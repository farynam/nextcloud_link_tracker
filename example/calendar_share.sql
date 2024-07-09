select  
'https://cloud.tm.meet.ovh/apps/calendar/p/' ||  ds.publicuri as link,
SUBSTRING(cals.principaluri, LENGTH(cals.principaluri) - position('/' in REVERSE(cals.principaluri) ) + 2) as owner,
to_timestamp(MAX(co.lastmodified))::timestamp as updated,
cals.displayname as resource
from oc_dav_shares ds
inner join oc_calendarobjects co on ds.resourceid = co.calendarid
inner join oc_calendars cals on cals.id = co.calendarid
where ds.publicuri is NOT null
group by ds.publicuri, cals.principaluri, cals.displayname;
