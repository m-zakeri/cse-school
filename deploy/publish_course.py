#!/usr/bin/env python3
"""Put a course (and its first lecture video) into a term on a running server.

Run from your own computer; only the admin API is used, so it works for any
server you can open in the browser. The admin password is asked for at the
prompt (or read from the ADMIN_PASSWORD environment variable); it is never
stored or printed.

    python deploy/publish_course.py --api http://172.23.131.11:8000/api/v1 \\
        --video 1404-12-17-cut-final.mp4

What it does (each step is skipped if it is already done, so re-running is safe):
  1. creates the term (default "ترم پاییز ۱۴۰۵", code 1405-1) if missing,
  2. copies the source course (default course #4, مهندسی نرم‌افزار) into that
     term, with its description and syllabus,
  3. sets the instructor (default دکتر مرتضی ذاکری),
  4. uploads the video as a free-preview first session.

Registration is open only for the CURRENT term; pass --activate to make the
new term current.
"""
import argparse
import getpass
import json
import os
import sys
import urllib.error
import urllib.request
import uuid


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--api", required=True, help="e.g. http://172.23.131.11:8000/api/v1")
    ap.add_argument("--email", default="admin@aut.ac.ir")
    ap.add_argument("--term-code", default="1405-1")
    ap.add_argument("--term-title", default="ترم پاییز ۱۴۰۵")
    ap.add_argument("--source-number", type=int, default=4, help="course number to copy")
    ap.add_argument("--instructor", default="دکتر مرتضی ذاکری")
    ap.add_argument("--video", help="path of the video file to upload")
    ap.add_argument("--video-title", default="جلسه اول")
    ap.add_argument("--activate", action="store_true", help="make the term the current one")
    args = ap.parse_args()

    api = args.api.rstrip("/")
    password = os.environ.get("ADMIN_PASSWORD") or getpass.getpass(f"Admin password for {args.email}: ")
    # A paste into the Windows prompt can carry stray control characters (Ctrl+V arrives as \x16) or spaces.
    password = "".join(ch for ch in password if ch.isprintable()).strip()
    token = None

    def call(method, path, body=None, raw=None, headers=None):
        h = {"Authorization": f"Bearer {token}"} if token else {}
        if raw is None:
            h["Content-Type"] = "application/json"
        h.update(headers or {})
        data = raw if raw is not None else (json.dumps(body).encode() if body is not None else None)
        req = urllib.request.Request(api + path, data=data, method=method, headers=h)
        try:
            with urllib.request.urlopen(req, timeout=600) as r:
                text = r.read().decode()
                return json.loads(text) if text else None
        except urllib.error.HTTPError as e:
            detail = e.read().decode(errors="replace")
            try:
                detail = json.loads(detail).get("detail", detail)
            except Exception:
                pass
            sys.exit(f"ERROR {e.code} on {method} {path}: {detail}")
        except urllib.error.URLError as e:
            sys.exit(f"ERROR cannot reach {api}: {e.reason}")

    print(f"password length: {len(password)} characters")
    token = call("POST", "/auth/login", {"identifier": args.email, "password": password})["access_token"]
    print("logged in")

    # 1. term
    terms = call("GET", "/terms/")
    term = next((t for t in terms if t["code"] == args.term_code), None)
    if term:
        print(f"term exists: {term['title']}")
    else:
        term = call("POST", "/terms/", {"title": args.term_title, "code": args.term_code})
        print(f"term created: {term['title']}")

    # 2. course
    source = call("GET", f"/courses/{args.source_number}")
    in_term = call("GET", f"/courses/?term={args.term_code}&include_inactive=true")
    course = next((c for c in in_term if c["title_fa"].strip() == source["title_fa"].strip()), None)
    if course:
        print(f"course exists in the term: #{course['course_number']} {course['title_fa']}")
    else:
        result = call("POST", "/courses/import", {"course_ids": [source["id"]], "target_term_id": term["id"]})
        if not result["created"]:
            sys.exit("ERROR the course was not created: " + "; ".join(s["reason"] for s in result["skipped"]))
        course = result["created"][0]
        print(f"course created: #{course['course_number']} {course['title_fa']}")

    # 3. instructor
    instructors = call("GET", "/instructors/")
    inst = next((i for i in instructors if i["name"].strip() == args.instructor.strip()), None)
    if not inst:
        sys.exit(f"ERROR instructor «{args.instructor}» not found; known: " + ", ".join(i["name"] for i in instructors))
    if (course.get("instructor") or {}).get("id") != inst["id"]:
        call("PUT", f"/courses/{course['id']}", {"instructor_id": inst["id"], "author": inst["name"]})
        print(f"instructor set: {inst['name']}")
    else:
        print(f"instructor already {inst['name']}")

    # 4. video
    if args.video:
        if not os.path.isfile(args.video):
            sys.exit(f"ERROR video file not found: {args.video}")
        existing = call("GET", f"/courses/{course['course_number']}/videos")
        if any(v["title"] == args.video_title for v in existing):
            print(f"video «{args.video_title}» already uploaded")
        else:
            size_mb = os.path.getsize(args.video) / 1024 / 1024
            print(f"uploading {size_mb:.0f} MB ... (this can take a while)")
            boundary = uuid.uuid4().hex
            head = b""
            for name, value in (("title", args.video_title), ("order_index", "1"), ("is_free_preview", "true")):
                head += f'--{boundary}\r\nContent-Disposition: form-data; name="{name}"\r\n\r\n{value}\r\n'.encode()
            head += (
                f'--{boundary}\r\nContent-Disposition: form-data; name="file"; filename="session1.mp4"\r\n'
                "Content-Type: video/mp4\r\n\r\n"
            ).encode()
            with open(args.video, "rb") as f:
                body = head + f.read() + f"\r\n--{boundary}--\r\n".encode()
            v = call(
                "POST", f"/courses/{course['id']}/videos", raw=body,
                headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
            )
            print(f"video uploaded: {v['title']} (free preview: {v['is_free_preview']})")

    # 5. current term
    if args.activate and not term["is_active"]:
        call("POST", f"/terms/{term['id']}/activate")
        print("term is now the current term (registration open)")
    elif not term["is_active"] and not args.activate:
        print("note: the term is NOT current, so registration for it is closed (re-run with --activate to open it)")

    site = api.split("/api/")[0].rsplit(":", 1)[0] + ":3000"
    print(f"\ndone. Course page: {site}/courses/{course['course_number']}/")


if __name__ == "__main__":
    main()
