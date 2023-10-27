You see in the browser devtools network tab, that a GET request to the `/_saved_copies` url is repeatedly getting sent about 5 times per second (the Supabase ORM is making those requests).

Fix the bug.
