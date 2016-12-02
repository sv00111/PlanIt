# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.
# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
import datetime


def get_user_email():
    return auth.user.email if auth.user else None

db.define_table('track',
                Field('artist'),
                Field('album'),
                Field('title'),
                Field('duration', 'float'),
                Field('rating', 'float'),
                Field('num_plays', 'integer'),
                Field('created_by', default=get_user_email()),
                Field('created_on', default=datetime.datetime.utcnow()),
                )

db.define_table('createdPlans',
                Field('planName'),
                Field('startDate'),
                Field('endDate'),
                Field('planLocation'),

                )

db.define_table('recommendation',
                Field('name'),
                Field('neighborhood'),
                Field('price', 'float'),
                Field('rating', 'float'),
                Field('created_by', default=get_user_email()),
                Field('created_on', default=datetime.datetime.utcnow()),
                )

db.define_table('planit_plan',
                Field('label', requires=[IS_ALPHANUMERIC()], length=256, default="New Plan %d".format(id)),
                Field('start_date', 'date', default=datetime.date.today()),
                Field('start_time', requires=[IS_TIME()], default=datetime.time(8)),
                Field('end_time', requires=[IS_TIME()],  default=datetime.time(18)),
                Field('start_location', requires=[IS_ALPHANUMERIC()], length=256),
                Field('longitude', 'double'),
                Field('latitude', 'double'),
                Field('stops', 'list:reference planit_stop'),
                Field('created_by', default=get_user_email()),
                Field('created_on', default=datetime.datetime.utcnow())
                )

db.define_table('planit_stop',
                Field('label', requires=[IS_ALPHANUMERIC()], length=256, default="New Stop %d".format(id)),
                Field('start_time', requires=[IS_TIME()], default=datetime.time(8)),
                Field('end_time', requires=[IS_TIME()],  default=datetime.time(18)),
                Field('place_id'),
                Field('cust_place'),
                Field('cust_address'),
                Field('cust_lon', 'double'),
                Field('cust_lat', 'double'),
                Field('parent', 'reference planit_plan'),
                Field('created_by', default=get_user_email()),
                Field('created_on', default=datetime.datetime.utcnow()),
                Field('comments', 'list:reference stop_comments'),
                Field('thumbnail', default="http://studiord.com.au/wp-content/uploads/2016/06/placeholder-180x180.jpg")
                )

db.define_table('stop_comments',
                Field('stop_id', 'reference planit_stop'),
                Field('created_by', default=get_user_email()),
                Field('comment_string'),
                Field('posted_on', default=datetime.datetime.utcnow()),
                Field('likes', 'integer', default=0))
