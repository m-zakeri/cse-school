"""End-to-end smoke test against a running stack (used by CI and after deploys).

    python backend/tests/e2e_smoke.py

Environment: API_URL (default http://localhost:8000/api/v1), SITE_URL (default
http://localhost:3000), ADMIN_EMAIL / ADMIN_PASSWORD (default: read FIRST_SUPERUSER_*
from ./.env). Uses only the standard library. It creates and removes its own
test data, and expects the seeded catalogue (courses 1-7 in term 1404-1).
"""
import json
import os
import random
import sys
import urllib.error
import urllib.request

API = os.environ.get("API_URL", "http://localhost:8000/api/v1")
SITE = os.environ.get("SITE_URL", "http://localhost:3000")
ENV = {}
if os.path.exists(".env"):
    for line in open(".env", encoding="utf-8"):
        if "=" in line and not line.startswith("#"):
            k, v = line.strip().split("=", 1)
            ENV[k] = v
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL") or ENV.get("FIRST_SUPERUSER_EMAIL", "admin@aut.ac.ir")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD") or ENV.get("FIRST_SUPERUSER_PASSWORD", "")

results = []


def call(method, path, body=None, token=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(API + path, data=data, method=method)
    req.add_header("Content-Type", "application/json")
    if token:
        req.add_header("Authorization", "Bearer " + token)
    try:
        with urllib.request.urlopen(req) as r:
            txt = r.read().decode()
            return r.status, (json.loads(txt) if txt else None)
    except urllib.error.HTTPError as e:
        txt = e.read().decode()
        try:
            return e.code, json.loads(txt)
        except Exception:
            return e.code, txt


def check(name, cond, extra=""):
    results.append((name, bool(cond)))
    print(("PASS " if cond else "FAIL ") + name + (f"  [{extra}]" if extra and not cond else ""))


def nid_with_checksum(prefix9):
    s = sum(int(prefix9[i]) * (10 - i) for i in range(9))
    r = s % 11
    return prefix9 + str(r if r < 2 else 11 - r)


st, adm = call("POST", "/auth/login", {"identifier": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
A = adm["access_token"]

# ---------- the site itself
for path in ("/", "/courses/", "/calendar/", "/admin/"):
    try:
        with urllib.request.urlopen(SITE + path, timeout=20) as r:
            check(f"frontend {path} -> 200", r.status == 200, r.status)
    except Exception as exc:
        check(f"frontend {path} -> 200", False, exc)
st, h = call("GET", "/")
check("API root answers", st == 200, st)

# ---------- terms
st, terms = call("GET", "/terms/")
check("terms list is public", st == 200 and len(terms) >= 1, (st, terms))
base = next(t for t in terms if t["code"] == "1404-1")
check("seeded term has calendar dates", base["exam_start"] and base["certificate_date"], base)
st, cur = call("GET", "/terms/current")
check("current term is 1404-1", st == 200 and cur and cur["code"] == "1404-1", cur)

fa = str.maketrans("0123456789", "۰۱۲۳۴۵۶۷۸۹")
code = "1405-1"
# leftovers from an earlier failed run
for t in terms:
    if t["code"] == code:
        call("DELETE", f"/terms/{t['id']}", token=A)

st, r = call("POST", "/terms/", {"title": "ترم پاییز ۱۴۰۵", "code": "1405-1"})
check("create term needs admin", st == 401, st)
st, t5 = call("POST", "/terms/", {"title": "ترم پاییز ۱۴۰۵", "code": code.translate(fa),
                                 "registration_start": "2026-09-06", "registration_end": "2026-09-27",
                                 "start_date": "2026-10-02", "end_date": "2026-12-16"}, token=A)
check("admin creates term (Persian-digit code normalised)", st == 201 and t5["code"] == code and not t5["is_active"], (st, t5))
st, r = call("POST", "/terms/", {"title": "تکراری", "code": code}, token=A)
check("duplicate code -> 409", st == 409, (st, r))
st, r = call("POST", "/terms/", {"title": "بد", "code": "x y"}, token=A)
check("bad code -> 422", st == 422, st)
st, r = call("POST", "/terms/", {"title": "بازه بد", "code": "9999-1", "start_date": "2026-12-01", "end_date": "2026-10-01"}, token=A)
check("end before start -> 422", st == 422, (st, r))
st, r = call("PUT", f"/terms/{t5['id']}", {"registration_end": "2026-08-01"}, token=A)
check("update validates merged ranges -> 422", st == 422, (st, r))
st, r = call("PUT", f"/terms/{t5['id']}", {"title": "ترم پاییز ۱۴۰۵ (ویرایش)", "exam_start": "2026-12-10"}, token=A)
check("update term", st == 200 and r["exam_start"] == "2026-12-10" and r["title"].endswith("(ویرایش)"), (st, r))

# ---------- courses and terms
st, default_list = call("GET", "/courses/")
check("default list is current term only, each with term", st == 200 and len(default_list) >= 7 and all(c["term"]["code"] == "1404-1" for c in default_list if c["term"]), st)
st, c4 = call("GET", "/courses/4")
check("detail carries term", c4["term"] and c4["term"]["code"] == "1404-1", c4.get("term"))
st, c1 = call("GET", "/courses/1")

st, res = call("POST", "/courses/import", {"course_ids": [c4["id"], c1["id"]], "target_term_id": t5["id"]}, token=A)
check("import two courses into new term", st == 201 and len(res["created"]) == 2 and not res["skipped"], (st, res))
imported = {c["title_fa"]: c for c in res["created"]}
check("copies live in target term", all(c["term"]["code"] == code for c in res["created"]))
st, copy4 = call("GET", f"/courses/{imported[c4['title_fa']]['course_number']}")
check("syllabus topics copied", len(copy4["topics"]) == len(c4["topics"]) > 0, (len(copy4["topics"]), len(c4["topics"])))
check("fields copied (description, tools)", copy4["description"] == c4["description"] and copy4["software_tools"] == c4["software_tools"])
check("copy has its own number and slug", copy4["course_number"] != c4["course_number"] and copy4["id"] != c4["id"])
st, vids = call("GET", f"/courses/{copy4['course_number']}/videos")
check("videos are not copied", st == 200 and vids == [], (st, vids))

st, res2 = call("POST", "/courses/import", {"course_ids": [c4["id"], c1["id"]], "target_term_id": t5["id"]}, token=A)
check("second import skips duplicates", st == 201 and not res2["created"] and len(res2["skipped"]) == 2, (st, res2))
st, res3 = call("POST", "/courses/import", {"course_ids": [copy4["id"]], "target_term_id": t5["id"]}, token=A)
check("importing into own term is skipped", st == 201 and len(res3["skipped"]) == 1, res3)
st, r = call("POST", "/courses/import", {"course_ids": [c4["id"]], "target_term_id": t5["id"]})
check("import needs admin", st == 401, st)

st, lst = call("GET", f"/courses/?term={code}")
check("filter by term code", st == 200 and len(lst) == 2, (st, len(lst) if isinstance(lst, list) else lst))
check("default list excludes the new term", all(c["id"] not in {x["id"] for x in res["created"]} for c in default_list))
st, allc = call("GET", "/courses/?term=all")
check("term=all lists every term", st == 200 and len(allc) >= len(default_list) + 2)
st, r = call("GET", "/courses/?term=nope")
check("unknown term -> 404", st == 404, st)

# ---------- registration follows the current term
suffix = str(random.randint(10000000, 99999999))
st, reg = call("POST", "/auth/register", {"national_id": nid_with_checksum("1" + suffix), "phone_number": "0912" + str(random.randint(1000000, 9999999)),
                                         "email": f"tq{suffix}@example.com", "full_name": "دانشجوی ترم", "password": "Qa-pass-123"})
S = reg["access_token"]
st, r = call("POST", "/enrollments/batch", {"course_ids": [copy4["course_number"]]}, token=S)
check("cannot enroll into a course of a non-current term (batch)", st == 404, (st, r))
st, r = call("POST", "/enrollments/", {"course_id": copy4["course_number"]}, token=S)
check("cannot enroll into a non-current term (single) -> 409", st == 409, (st, r))
st, r = call("POST", "/enrollments/batch", {"course_ids": [5]}, token=S)
check("current term still enrolls", st == 201, (st, r))
eid = r[0]["id"]
check("enrollment course carries its term", r[0]["course"]["term"]["code"] == "1404-1", r[0].get("course"))

# ---------- admin users, temporary passwords
st, r = call("GET", "/users/", token=S)
check("users list is admin only", st == 403, st)
st, found = call("GET", "/users/?q=" + f"tq{suffix}", token=A)
check("admin finds the student by e-mail", st == 200 and len(found) == 1 and found[0]["enrollment_count"] == 1, (st, found))
student_id = found[0]["id"]
st, r = call("POST", f"/users/{student_id}/reset-password", token=S)
check("reset password is admin only", st == 403, st)
st, tmp = call("POST", f"/users/{student_id}/reset-password", token=A)
check("admin issues a temporary password", st == 200 and len(tmp["temporary_password"]) >= 8, (st, tmp))
st, r = call("POST", "/auth/login", {"identifier": f"tq{suffix}@example.com", "password": "Qa-pass-123"})
check("old password stops working", st == 401, st)
st, r = call("POST", "/auth/login", {"identifier": f"tq{suffix}@example.com", "password": tmp["temporary_password"]})
check("temporary password works and flags a forced change", st == 200 and r["user"]["must_change_password"] is True, (st, r))
S = r["access_token"]
st, r = call("PUT", "/auth/profile", {"current_password": tmp["temporary_password"], "new_password": "Qa-pass-456"}, token=S)
check("choosing a new password clears the flag", st == 200 and r["must_change_password"] is False, (st, r))
st, r = call("PATCH", f"/users/{found[0]['id']}", {"is_active": False}, token=A)
check("admin deactivates an account", st == 200 and r["is_active"] is False, (st, r))
st, r = call("GET", "/auth/me", token=S)
check("deactivated account is locked out", st == 403, st)
st, r = call("PATCH", f"/users/{found[0]['id']}", {"is_active": True}, token=A)
check("admin reactivates it", st == 200 and r["is_active"] is True, (st, r))
st, me = call("GET", "/auth/me", token=A)
st, r = call("PATCH", f"/users/{me['id']}", {"is_active": False}, token=A)
check("admin cannot deactivate themselves", st == 400, (st, r))

# ---------- video progress (needs object storage, so it uploads a tiny fake clip)
import uuid as _uuid
c5 = call("GET", "/courses/5")[1]
boundary = _uuid.uuid4().hex
CRLF = chr(13) + chr(10)
parts = []
for name, value in (("title", "جلسه آزمایشی"), ("order_index", "1"), ("is_free_preview", "false"), ("duration_seconds", "100")):
    parts.append(f'--{boundary}{CRLF}Content-Disposition: form-data; name="{name}"{CRLF}{CRLF}{value}{CRLF}'.encode())
parts.append((f'--{boundary}{CRLF}Content-Disposition: form-data; name="file"; filename="t.mp4"{CRLF}'
              f"Content-Type: video/mp4{CRLF}{CRLF}").encode())
parts.append(bytes(2048))
parts.append(f"{CRLF}--{boundary}--{CRLF}".encode())
body = b"".join(parts)
req = urllib.request.Request(API + f"/courses/{c5['id']}/videos", data=body, method="POST",
                             headers={"Authorization": "Bearer " + A, "Content-Type": f"multipart/form-data; boundary={boundary}"})
try:
    with urllib.request.urlopen(req) as resp:
        vid = json.loads(resp.read().decode())
except urllib.error.HTTPError as exc:
    vid = None
    check("test video uploads", False, exc.read().decode())
if vid:
    vp = f"/courses/5/videos/{vid['id']}/progress"
    st, r = call("PUT", vp, {"position_seconds": 30})
    check("progress needs login", st == 401, st)
    st, r = call("PUT", vp, {"position_seconds": 30, "duration_seconds": 100}, token=S)
    check("enrolled student saves progress", st == 200 and r["position_seconds"] == 30 and not r["completed"], (st, r))
    st, lst = call("GET", "/courses/5/videos", token=S)
    check("video list returns the resume point", st == 200 and lst[0]["progress_seconds"] == 30, (st, lst))
    st, cont = call("GET", "/courses/videos/progress/me", token=S)
    check("continue-watching lists it", st == 200 and cont and cont[0]["video_id"] == vid["id"] and cont[0]["course_number"] == 5, (st, cont))
    st, r = call("PUT", vp, {"position_seconds": 95, "duration_seconds": 100}, token=S)
    check("90% watched counts as completed", st == 200 and r["completed"], (st, r))
    st, r = call("PUT", vp, {"position_seconds": 5, "duration_seconds": 100}, token=S)
    check("completed stays completed after rewinding", st == 200 and r["completed"], (st, r))
    st, other = call("POST", "/auth/register", {"national_id": nid_with_checksum("2" + suffix), "phone_number": "0913" + str(random.randint(1000000, 9999999)),
                                               "email": f"to{suffix}@example.com", "full_name": "دانشجوی دیگر", "password": "Qa-pass-123"})
    st, r = call("PUT", vp, {"position_seconds": 10}, token=other["access_token"])
    check("student without enrollment cannot save progress -> 403", st == 403, (st, r))
    call("DELETE", f"/courses/{c5['id']}/videos/{vid['id']}", token=A)

# moving a course with enrollments is refused; without is fine
c5 = call("GET", "/courses/5")[1]
st, r = call("PUT", f"/courses/{c5['id']}", {"term_id": t5["id"]}, token=A)
check("moving a course that has enrollments -> 409", st == 409, (st, r))
st, r = call("PUT", f"/courses/{copy4['id']}", {"term_id": base["id"]}, token=A)
check("moving an empty course changes its term", st == 200 and r["term"]["code"] == "1404-1", (st, r.get("term") if isinstance(r, dict) else r))
st, r = call("PUT", f"/courses/{copy4['id']}", {"term_id": t5["id"]}, token=A)
check("...and back", st == 200 and r["term"]["code"] == code, r)

# activate the new term: old courses close, new ones open
st, r = call("POST", f"/terms/{t5['id']}/activate", token=A)
check("activate term", st == 200 and r["is_active"], (st, r))
st, terms2 = call("GET", "/terms/")
check("exactly one active term", sum(1 for t in terms2 if t["is_active"]) == 1)
st, now_default = call("GET", "/courses/")
check("default list switches to the new current term", {c["id"] for c in now_default} == {c["id"] for c in res["created"]}, len(now_default))
st, r = call("POST", "/enrollments/batch", {"course_ids": [5]}, token=S)
check("old term now closed for registration (idempotent for existing enrollment)", st == 201 or st == 404, (st, r))
st, r = call("POST", "/enrollments/batch", {"course_ids": [copy4["course_number"]]}, token=S)
check("new term opens", st == 201, (st, r))
new_eid = r[0]["id"]

# back to normal and cleanup
st, r = call("POST", f"/terms/{base['id']}/activate", token=A)
check("switch current term back", st == 200 and r["code"] == "1404-1", r)
st, r = call("DELETE", f"/terms/{t5['id']}", token=A)
check("term with courses cannot be deleted -> 409", st == 409, (st, r))
call("DELETE", f"/enrollments/admin/{eid}", token=A)
call("DELETE", f"/enrollments/admin/{new_eid}", token=A)
for c in res["created"]:
    call("DELETE", f"/courses/{c['id']}", token=A)
st, r = call("DELETE", f"/terms/{t5['id']}", token=A)
check("empty term deletes", st == 204, (st, r))

st, cur = call("GET", "/terms/current")
check("current term restored", cur and cur["code"] == "1404-1", cur)

failed = [n for n, ok in results if not ok]
print(f"\n{len(results) - len(failed)}/{len(results)} passed")
sys.exit(1 if failed else 0)
