if (typeof links === 'undefined') {
    links = {};
    links.locales = {};
} else if (typeof links.locales === 'undefined') {
    links.locales = {};
}
// Danish ===================================================
links.locales['da'] = {
    'MONTHS': new Array("Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"),
    'MONTHS_SHORT': new Array("jan", "feb", "mar", "apr", "maj", "jun", "jul", "aug", "sep", "okt", "nov", "dec"),
    'DAYS': new Array("søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"),
    'DAYS_SHORT': new Array("søn", "man", "tir", "ons", "tor", "fre", "lør"),
    'ZOOM_IN': "Zoom ind",
    'ZOOM_OUT': "Zoom ud",
    'MOVE_LEFT': "Flyt til venstre",
    'MOVE_RIGHT': "Flyt til højre",
    'NEW': "Ny",
    'CREATE_NEW_EVENT': "Opret ny annotation"
};
links.locales['da_DK'] = links.locales['da'];