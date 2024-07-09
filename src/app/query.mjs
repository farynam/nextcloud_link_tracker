export class Query {

    static getFileShareQuery(domain) {
        return `select 
            uid_owner as owner, 
            file_target as resource, 
            'https://${domain}/s/'|| token as link, 
            to_timestamp(stime)::timestamp as updated
            from oc_Share
            WHERE share_type = 3
            AND to_timestamp(stime)::timestamp > $1
            ;`;
    }


    /**
     * Empty calendars are not returned
     * @param {*} domain 
     * @returns 
     */
    static getCalendarShareQuery(domain) {
        return `select  
        SUBSTRING(cals.principaluri, LENGTH(cals.principaluri) - position('/' in REVERSE(cals.principaluri) ) + 2) as owner,
        cals.displayname as resource,
        'https://${domain}/apps/calendar/p/' ||  ds.publicuri as link,
        to_timestamp(MAX(co.lastmodified))::timestamp as updated
        from oc_dav_shares ds
        inner join oc_calendarobjects co on ds.resourceid = co.calendarid
        inner join oc_calendars cals on cals.id = co.calendarid
        where ds.publicuri is NOT null
        AND to_timestamp(co.lastmodified)::timestamp > $1 
        group by ds.publicuri, cals.principaluri, cals.displayname
        ;`;
    }
    
    static getFormQuery(domain) {
        return `SELECT
        forms.owner_id as owner, 
        forms.title as resource,
        'https://${domain}/apps/forms/s/' || fs.share_with as link,
        to_timestamp(forms.last_updated)::timestamp as updated
        from oc_forms_v2_forms forms 
        inner join oc_forms_v2_shares fs on fs.form_id = forms.id
        WHERE share_type = 3
        AND to_timestamp(forms.last_updated) > $1
        ;`;
    }

}


