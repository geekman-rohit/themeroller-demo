create table if not exists theme (
	id int unsigned not null auto_increment,
	name varchar(100),
	data TEXT,
	keywords varchar(200),
	created TIMESTAMP DEFAULT 0 not null,
	updated TIMESTAMP DEFAULT 0 ON UPDATE CURRENT_TIMESTAMP,
	primary key(id),
	index(name)
)
