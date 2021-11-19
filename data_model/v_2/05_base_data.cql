/*
  05_base_data.cql
*/

INSERT INTO colorado.heatdata (heatid, lastid, competition, event, heat, creation_date, swimstyle, distance, lanes)
           VALUES (4e2c1f5c-4121-4a8c-9ebc-521b5a8b1e1a, 4e2c1f5c-4121-4a8c-9ebc-521b5a8b1e1a, 'Schwimmen', 'Meeting Fürth' , 
           'Neu laden für Aktualisierung' ,toTimeStamp(now()), 'Disziplin', 'Streckenlänge in  ',
           ['{"athleteid":"0","lastname":"Noch nicht","firstname":"gestartet"}']
           );


/*
                              , [{
      athleteid: '0',
      birthdate: '2013-01-01',
      firstname: 'Welcome',
      lastname: ''
    }]
*/