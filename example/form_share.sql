SELECT
forms.title,
'https://cloud.tm.meet.ovh/apps/forms/s/' || fs.share_with,
forms.owner_id, 
to_timestamp(forms.created)
from oc_forms_v2_forms forms 
inner join oc_forms_v2_shares fs on fs.form_id = forms.id
WHERE share_type = 3;