select uid_owner, 
file_target, 
'https://cloud.tm.meet.ovh/s/'|| token, 
to_timestamp(stime)::timestamp 
from oc_Share
WHERE share_type = 3;