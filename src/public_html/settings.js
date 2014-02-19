var Settings = Settings || {};

// ---------------------
// Nyt logo.
// Nyt login
// filtering af skemaer
// ----------------------

Settings.title = "LARM.fm";
//Settings.title = "Sendeplanen";

Settings.brandName = "larm";
Settings.brandModule = "brand/larm";

Settings.locale = "en";

//Settings.servicePath = "http://api.test.chaos-systems.com";
//Settings.servicePath = "http://api.chaos-systems.com";
Settings.servicePath = "http://api.larm.fm";
Settings.wayfPath = "https://wayf.larm.fm";
Settings.clientGUID = "3D652FD1-33FA-40F7-A440-A942A1317F99";

Settings.accessPointGuid = "00000000-0000-0000-0000-000007000000";

Settings.anonymousUsername = "thfl@dr.dk";
Settings.anonymousPassword = "1234";

Settings.username = "thfl@dr.dk";
Settings.password = "1234";

Settings.startPath = "!search";
Settings.publicPaths = ['AppLoader', 'Login'];

Settings.Search = {
    //filter: "(Type:Schedule OR Type:ScheduleNote)",
    filter: "",
    sortitems: [
        { title: "sorter...", id: "", value: "PubStartDate+asc" },
        { title: "Sendetidspunkt (ældst først)", id: "1", value: "PubStartDate+asc" },
        { title: "Sendetidspunkt (nyeste først)", id: "2", value: "PubStartDate+desc" },
        { title: "Titel (a til z)", id: "3", value: "Title+asc" },
        { title: "Title (z til a)", id: "4", value: "Title+desc" },
        { title: "Antal annotationer (flest først)", id: "5", value: "AnnotationCount+desc" }//,
        //{ title: "LARM OCR Parsing (mindst først)", id: "6", value: "OCR-Report_float+asc" },
        //{ title: "LARM OCR Parsing (højest først)", id: "7", value: "OCR-Report_float+desc" }
    ],
    objecttypefilter: [
        { fid: "0", title: "Alt", value: "" },
        { fid: "1", title: "Radio", value: "Radio" },
        { fid: "2", title: "Programoversigter", value: "Schedule" },
        { fid: "3", title: "Rettelser til programoversigter", value: "ScheduleNote" }
    ],
    UIViews:
    {
        search: "viewmodels/search",
        //search: "viewmodels/search_sendeplan",

        //searchResult: searchresults
        searchResult: "quicksearchresults"
    },
    viewName: "Search",
    objectTypes: [
        {
            id: 0,
            metadataSchemaGuid: "00000000-0000-0000-0000-0000df820000"
        }
    ],

    indexes: [
        // key
        { key: "m00000000-0000-0000-0000-0000df820000_da_all" }
    ]
};

Settings.Object = {
    FileInfosSchemaGuid: '00000000-0000-0000-0000-0000dd820000'
};

// TODO: Settings.Schema is filled out from Settings.MetadataSchemas
Settings.Schema = [];
// LARM.Annotation.Comment
//Settings.Schema['d0edf6f9-caf0-ac41-b8b3-b0d950fdef4e'] =
//{
//    view: 'annotation',
//    edit: 'anncommentedit'
//};

//// LARM.Annotation.WP5.8.2.Jingles
//Settings.Schema['7bb8d425-6e60-9545-80f4-0765c5eb6be6'] =
//{
//    view: 'annotation_readonly',
//    edit: ''
//};

//// LARM.Annotation.WP5.8.1.LydkildeBeskrivelse
//Settings.Schema['c446ad50-f1ea-f642-9361-3f6b56c5f320'] =
//{
//    view: 'annotation_readonly',
//    edit: ''
//};


Settings.MetadataSchemas = [
    {
        guid: '00000000-0000-0000-0000-0000dd820000',
        name: 'Larm.FileInfos',
        schemaxml: '<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="Larm.FileInfos"><xs:complexType><xs:sequence><xs:element maxOccurs="unbounded" name="Larm.FileInfo"><xs:complexType><xs:sequence><xs:element name="StartOffSetMS" type="xs:unsignedInt" /><xs:element name="EndOffSetMS" type="xs:unsignedInt" /><xs:element name="FileName" type="xs:string" /><xs:element name="Index" type="xs:unsignedByte" /></xs:sequence></xs:complexType></xs:element></xs:sequence></xs:complexType></xs:element></xs:schema>',
        schemajson: null,
        arraypaths: [],
        view: '',
        edit: ''
    },
    {
        guid: '00000000-0000-0000-0000-0000df820000',
        name: 'Larm.Program',
        schemaxml: '<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="Larm.Program"><xs:complexType><xs:sequence><xs:element name="PublicationDateTime" type="xs:dateTime" /><xs:element name="PublicationEndDateTime" type="xs:dateTime" /><xs:element name="PublicationChannel" type="xs:string" /><xs:element name="Title" type="xs:string" /><xs:element name="Abstract" type="xs:string" /><xs:element name="Description" type="xs:string" /><xs:element name="Publisher" type="xs:string" /><xs:element name="Subjects"><xs:complexType><xs:sequence><xs:element name="Subject" type="xs:string" minOccurs="0" maxOccurs="unbounded" /></xs:sequence></xs:complexType></xs:element><xs:element name="Contributors"><xs:complexType><xs:sequence><xs:element name="Contributor" minOccurs="0" maxOccurs="unbounded"><xs:complexType><xs:sequence><xs:element name="Name" type="xs:string" /><xs:element name="RoleName" type="xs:string" /><xs:element name="RoleID" type="xs:string" /></xs:sequence></xs:complexType></xs:element></xs:sequence></xs:complexType></xs:element><xs:element name="Creators"><xs:complexType><xs:sequence><xs:element name="Creator" minOccurs="0" maxOccurs="unbounded"><xs:complexType><xs:sequence><xs:element name="Name" type="xs:string" /><xs:element name="RoleName" type="xs:string" /><xs:element name="RoleID" type="xs:string" /></xs:sequence></xs:complexType></xs:element></xs:sequence></xs:complexType></xs:element><xs:element name="Locations"><xs:complexType><xs:sequence><xs:element name="Name" type="xs:string" minOccurs="0" maxOccurs="unbounded" /></xs:sequence></xs:complexType></xs:element><xs:element name="Identifiers"><xs:complexType><xs:sequence><xs:element name="DR.ProductionNumber" type="xs:string" /><xs:element name="DR.ArchiveNumber" type="xs:string" /><xs:element name="SB.DomsID" type="xs:string" /></xs:sequence></xs:complexType></xs:element></xs:sequence></xs:complexType></xs:element></xs:schema>',
        schemajson: null,
        arraypaths: [],
        view: '',
        edit: ''
    },
    {
        guid: '00000000-0000-0000-0000-0000e4820000',
        name: 'Larm.CommentInfos',
        schemaxml: '<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="Larm.CommentInfos"><xs:complexType><xs:sequence><xs:element name="CommentInfo"><xs:complexType><xs:sequence><xs:element name="UserGUID" type="xs:string" /><xs:element name="CreateDate" type="xs:dateTime" /><xs:element name="Title" type="xs:string" /><xs:element name="Description" type="xs:string" /><xs:element name="StartTimeMS" type="xs:unsignedByte" /><xs:element name="EndTimeMS" type="xs:unsignedByte" /></xs:sequence></xs:complexType></xs:element></xs:sequence></xs:complexType></xs:element></xs:schema>',
        schemajson: null,
        arraypaths: [],
        view: '',
        edit: ''
    },
    {
        guid: '419ed517-fb13-9a46-a138-bb691f13f2ba',
        name: 'LARM.Metadata',
        schemaxml: '<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="Larm.Metadata"><xs:complexType><xs:sequence><xs:element name="Title" type="xs:string" /><xs:element name="Description" type="xs:string" /><xs:element name="Genre" type="OpenEnumerationList_Tags" /><xs:element name="Subjects" type="OpenEnumerationList_Tags" /><xs:element name="Tags" type="OpenEnumerationList_Tags" /><xs:element name="Note" type="xs:string" /><xs:element name="RelatedObjects" type="xs:string" /><xs:element name="Contributors"><xs:complexType><xs:sequence><xs:element name="Contributor" minOccurs="0" maxOccurs="unbounded"><xs:complexType><xs:sequence><xs:element name="Name" type="xs:string" /><xs:element name="RoleName" type="xs:string" /><xs:element name="Subject" type="xs:string" /></xs:sequence></xs:complexType></xs:element></xs:sequence></xs:complexType></xs:element></xs:sequence></xs:complexType></xs:element><xs:simpleType name="OpenEnumerationList_Tags"><xs:list itemType="xs:string" /></xs:simpleType></xs:schema>',
        schemajson: null,
        arraypaths: [],
        view: '',
        edit: ''
    },
    {
        guid: '1fd4e56e-3f3a-4f25-ba3e-3d9f80d5d49e',
        name: 'CHAOS.Profile',
        schemaxml: '<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="CHAOS.Profile"><xs:complexType><xs:sequence><xs:element name="Name" type="xs:string" /><xs:element name="Title" type="xs:string" /><xs:element name="Organization" type="xs:string" /><xs:element name="About" type="xs:string" /><xs:element name="Emails"><xs:complexType><xs:sequence><xs:element maxOccurs="unbounded" name="Email" type="xs:string" /></xs:sequence></xs:complexType></xs:element><xs:element name="Phonenumbers"><xs:complexType><xs:sequence><xs:element maxOccurs="unbounded" name="Phonenumber" type="xs:string" /></xs:sequence></xs:complexType></xs:element><xs:element name="Websites"><xs:complexType><xs:sequence><xs:element maxOccurs="unbounded" name="Website" type="xs:string" /></xs:sequence></xs:complexType></xs:element><xs:element name="Skype" type="xs:string" /><xs:element name="LinkedIn" type="xs:string" /><xs:element name="Twitter" type="xs:string" /><xs:element name="Address" type="xs:string" /><xs:element name="City" type="xs:string" /><xs:element name="Zipcode" type="xs:unsignedInt" /><xs:element name="Country" type="xs:string" /></xs:sequence></xs:complexType></xs:element></xs:schema>',
        schemajson: null,
        arraypaths: [],
        view: '',
        edit: ''
    },
    {
        guid: '25d4b87b-606e-4595-80f4-0765c5eb6be6',
        name: 'LARM.Annotation.WP5.8.2.Jingles',
        schemaxml: '<xs:schema elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="LARM.Annotation.WP5.8.2.Jingles"><xs:complexType><xs:complexContent><xs:extension base="TimedAnnotation"><xs:sequence><xs:element name="Title" type="OpenEnumerationList_WP582_Title" /><xs:element name="Tags" type="OpenEnumerationList_WP582_Tags" /><xs:element name="Classification" type="Enumeration_Classification" /><xs:element name="JingleID" type="OpenEnumerationList_WP582_Jingle" /><xs:element name="FromPeriod" type="xs:dateTime" /><xs:element name="ToPeriod" type="xs:dateTime" /><xs:element name="ComponistType" type="Enumeration_ComponistType" /><xs:element name="ComponistName" type="xs:string" /><xs:element name="SourceType" type="Enumeration_SourceType" /><xs:element name="SourceMusicTitle" type="xs:string" /><xs:element name="CreatorMusic" type="xs:string" /><xs:element name="DescriptionMusic" type="xs:string" /><xs:element name="SpeakTranscribe" type="xs:string" /><xs:element name="SpeakDescription" type="xs:string" /><xs:element name="SoundType" type="EnumerationList_SoundType" /><xs:element name="SoundTags" type="OpenEnumerationList_WP582_SoundTags" /><xs:element name="MusicStyleTags" type="OpenEnumerationList_WP582_MusicStyleTags" /><xs:element name="ProgramGenre" type="OpenEnumerationList_WP582_ProgramGenre" /><xs:element name="JingleVariant" type="xs:string" /><xs:element name="MixTypeIn" type="Enumeration_MixTypeIn" /><xs:element name="MixTypeOut" type="Enumeration_MixTypeOut" /><xs:element name="MixTypeSoundLevel" type="Enumeration_MixTypeSoundLevel" /></xs:sequence></xs:extension></xs:complexContent></xs:complexType></xs:element><xs:simpleType name="OpenEnumerationList_WP582_Title"><xs:list itemType="xs:string" /></xs:simpleType><xs:simpleType name="OpenEnumerationList_WP582_Tags"><xs:list itemType="xs:string" /></xs:simpleType><xs:simpleType name="OpenEnumerationList_WP582_Jingle"><xs:list itemType="xs:string" /></xs:simpleType><xs:simpleType name="OpenEnumerationList_WP582_SoundTags"><xs:list itemType="xs:string" /></xs:simpleType><xs:simpleType name="OpenEnumerationList_WP582_MusicStyleTags"><xs:list itemType="xs:string" /></xs:simpleType><xs:simpleType name="OpenEnumerationList_WP582_ProgramGenre"><xs:list itemType="xs:string" /></xs:simpleType><xs:simpleType name="Enumeration_Classification"><xs:restriction base="xs:string"><xs:enumeration value="Intro" /><xs:enumeration value="Skiller" /><xs:enumeration value="Outro" /><xs:enumeration value="Station ID" /><xs:enumeration value="Andet" /></xs:restriction></xs:simpleType><xs:simpleType name="Enumeration_SourceType"><xs:restriction base="xs:string"><xs:enumeration value="Musik" /><xs:enumeration value="Medieklip" /><xs:enumeration value="Andet" /></xs:restriction></xs:simpleType><xs:simpleType name="Enumeration_ComponistType"><xs:restriction base="xs:string"><xs:enumeration value="Person" /><xs:enumeration value="Redaktion" /><xs:enumeration value="Ukendt" /></xs:restriction></xs:simpleType><xs:simpleType name="EnumerationList_SoundType"><xs:restriction base="xs:string"><xs:enumeration value="Musikinstrument" /><xs:enumeration value="Andre lydkilder" /></xs:restriction></xs:simpleType><xs:simpleType name="Enumeration_MixTypeOut"><xs:restriction base="xs:string"><xs:enumeration value="Fader ud" /><xs:enumeration value="Klippes ud" /><xs:enumeration value="Krydsfades ud" /><xs:enumeration value="Fades til baggrund" /><xs:enumeration value="Ophører" /></xs:restriction></xs:simpleType><xs:simpleType name="Enumeration_MixTypeIn"><xs:restriction base="xs:string"><xs:enumeration value="Fader ind" /><xs:enumeration value="Klippes ind" /><xs:enumeration value="Krydsfades ind" /><xs:enumeration value="Fades op fra baggrund" /><xs:enumeration value="Opstår" /></xs:restriction></xs:simpleType><xs:simpleType name="Enumeration_MixTypeSoundLevel"><xs:restriction base="xs:string"><xs:enumeration value="Forgrund" /><xs:enumeration value="Mellemgrund" /><xs:enumeration value="Baggrund" /></xs:restriction></xs:simpleType><xs:complexType name="TimedAnnotation"><xs:attribute name="StartTime" type="TimeSpan" use="required" /><xs:attribute name="EndTime" type="TimeSpan" use="required" /></xs:complexType><xs:simpleType name="TimeSpan"><xs:restriction base="xs:string"><xs:pattern value="(d+.)?dd:dd:dd(.d{7})?" /></xs:restriction></xs:simpleType></xs:schema>',
        schemajson: null,
        arraypaths: [],
        view: 'annotation_readonly',
        edit: ''
    },
    {
        guid: 'c446ad50-f1ea-f642-9361-3f6b56c5f320',
        name: 'LARM.Annotation.WP5.8.1.LydkildeBeskrivelse',
        schemaxml: '<xs:schema elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="LARM.Annotation.WP5.8.1.LydkildeBeskrivelse"><xs:complexType><xs:complexContent><xs:extension base="TimedAnnotation"><xs:sequence><xs:element name="SoundSourceName" type="xs:string" /><xs:element name="Tags" type="OpenEnumerationList_Tags" /><xs:element name="MixTypeIn" type="Enumeration_MixTypeIn" /><xs:element name="MixTypeOut" type="Enumeration_MixTypeOut" /><xs:element name="MixTypeSoundLevel" type="Enumeration_MixTypeSoundLevel" /><xs:element name="SoundType" type="EnumerationList_SoundType" /><xs:element name="Anchorage" type="Enumeration_Anchorage" /><xs:element name="Description" type="xs:string" /></xs:sequence></xs:extension></xs:complexContent></xs:complexType></xs:element><xs:simpleType name="OpenEnumerationList_Tags"><xs:list itemType="xs:string" /></xs:simpleType><xs:simpleType name="Enumeration_MixTypeOut"><xs:restriction base="xs:string"><xs:enumeration value="Fader ud" /><xs:enumeration value="Klippes ud" /><xs:enumeration value="Krydsfades ud" /><xs:enumeration value="Ophører" /></xs:restriction></xs:simpleType><xs:simpleType name="Enumeration_MixTypeIn"><xs:restriction base="xs:string"><xs:enumeration value="Fader ind" /><xs:enumeration value="Klippes ind" /><xs:enumeration value="Krydsfades ind" /><xs:enumeration value="Opstår" /></xs:restriction></xs:simpleType><xs:simpleType name="Enumeration_MixTypeSoundLevel"><xs:restriction base="xs:string"><xs:enumeration value="Forgrund" /><xs:enumeration value="Mellemgrund" /><xs:enumeration value="Baggrund" /></xs:restriction></xs:simpleType><xs:simpleType name="EnumerationList_SoundType"><xs:list itemType="SoundTypeList" /></xs:simpleType><xs:simpleType name="SoundTypeList"><xs:restriction base="xs:string"><xs:enumeration value="Reallyd" /><xs:enumeration value="Effektlyd" /><xs:enumeration value="Scenografisk lyd" /></xs:restriction></xs:simpleType><xs:simpleType name="Enumeration_Anchorage"><xs:restriction base="xs:string"><xs:enumeration value="Rumlig forankring" /><xs:enumeration value="Semantisk forankring" /><xs:enumeration value="Rytmisk forankring" /><xs:enumeration value="Montage" /><xs:enumeration value="Tematisk forankring" /></xs:restriction></xs:simpleType><xs:complexType name="TimedAnnotation"><xs:attribute name="StartTime" type="TimeSpan" use="required" /><xs:attribute name="EndTime" type="TimeSpan" use="required" /></xs:complexType><xs:simpleType name="TimeSpan"><xs:restriction base="xs:string"><xs:pattern value="(d+.)?dd:dd:dd(.d{7})?" /></xs:restriction></xs:simpleType></xs:schema>',
        schemajson: null,
        arraypaths: [],
        view: 'annotation_lydkilde',
        edit: ''
    },
    {
        guid: '63fe50ba-ca9c-45a4-97fd-7ff9ed5de022',
        name: 'LARM.AttachedFileInfo',
        schemaxml: '<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="LARM.AttachedFileInfo"><xs:complexType><xs:sequence><xs:element name="Title" type="xs:string" /><xs:element name="Description" type="xs:string" /><xs:element name="FilesizeKB" type="xs:int" /></xs:sequence></xs:complexType></xs:element></xs:schema>',
        schemajson: null,
        arraypaths: [],
        view: '',
        edit: ''
    },
    {
        guid: '70c26faf-b1ee-41e8-b916-a5a16b25ca69',
        name: 'OCR',
        schemaxml: '<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" attributeFormDefault="unqualified" elementFormDefault="qualified"><xs:element name="Larm.HvideProgram"><xs:complexType><xs:sequence><xs:element name="Titel" type="xs:string" /><xs:element name="Filename" type="xs:string" /><xs:element name="AllText" type="xs:string" /><xs:element name="Date" type="xs:dateTime" /><xs:element name="Type" type="xs:string" /></xs:sequence></xs:complexType></xs:element></xs:schema>',
        schemajson: null,
        arraypaths: [],
        view: '',
        edit: ''
    },
    {
        guid: '7e08dbc3-c60c-4b42-bcd8-8d0ed8dbba36',
        name: 'LARM.radio',
        schemaxml: '<xsd:schema attributeFormDefault="unqualified" elementFormDefault="qualified" version="1.0" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><xsd:element name="metadata"><xsd:complexType><xsd:sequence><xsd:element name="titel" type="xsd:string" /><xsd:element name="varighed" type="xsd:string" /><xsd:element name="serietitel" type="xsd:string" /><xsd:element name="producenter"><xsd:complexType><xsd:sequence><xsd:element maxOccurs="unbounded" name="producent" type="xsd:string" /></xsd:sequence></xsd:complexType></xsd:element><xsd:element name="beskrivelse" type="xsd:string" /><xsd:element name="tags"><xsd:complexType><xsd:sequence><xsd:element maxOccurs="unbounded" name="tag" type="xsd:string" /></xsd:sequence></xsd:complexType></xsd:element></xsd:sequence></xsd:complexType></xsd:element></xsd:schema>',
        schemajson: null,
        arraypaths: [],
        view: '',
        edit: ''
    },
    {
        guid: 'ccc8239f-8d24-9743-945c-e8532cf1bcd2',
        name: 'LARM.radio.producent',
        schemaxml: '<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="producent"><xs:complexType><xs:sequence><xs:element type="xs:string" name="navn" /><xs:element type="xs:string" name="beksrivelse" /></xs:sequence></xs:complexType></xs:element></xs:schema>',
        schemajson: null,
        arraypaths: [],
        view: '',
        edit: ''
    },
    {
        guid: 'd35d2637-e0d3-439c-9b61-94221853989b',
        name: 'LARM.AnnotationCount',
        schemaxml: '<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="LARM.AnnotationCount"><xs:complexType><xs:sequence><xs:element name="TotalCount" type="xs:unsignedByte" /></xs:sequence></xs:complexType></xs:element></xs:schema>',
        schemajson: null,
        arraypaths: [],
        view: '',
        edit: ''
    },
    {
        guid: 'f0eece5e-9787-2140-83d0-d9110fe96c53',
        name: 'LARM.radio.serie',
        schemaxml: '<xs:schema attributeFormDefault="unqualified" elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="serie"><xs:complexType><xs:sequence><xs:element type="xs:string" name="navn" /><xs:element type="xs:string" name="beskrivelse" /></xs:sequence></xs:complexType></xs:element></xs:schema>',
        schemajson: null,
        arraypaths: [],
        view: '',
        edit: ''
    },
    {
        //guid: 'f9f6edd0-f0ca-41ac-b8b3-b0d950fdef4e',
        guid: 'd0edf6f9-caf0-ac41-b8b3-b0d950fdef4e',
        name: 'LARM.Annotation.Comment',
        schemaxml: '<xs:schema id="LARM.Annotation.Comment" elementFormDefault="qualified" xmlns:xs="http://www.w3.org/2001/XMLSchema"><xs:element name="LARM.Annotation.Comment"><xs:complexType><xs:complexContent><xs:extension base="TimedAnnotation"><xs:sequence><xs:element name="Title" type="xs:string" /><xs:element name="Description" type="xs:string" /></xs:sequence></xs:extension></xs:complexContent></xs:complexType></xs:element><xs:complexType name="TimedAnnotation"><xs:attribute name="StartTime" type="TimeSpan" use="required" /><xs:attribute name="EndTime" type="TimeSpan" use="required" /></xs:complexType><xs:simpleType name="TimeSpan"><xs:restriction base="xs:string"><xs:pattern value="(d+.)?dd:dd:dd(.d{7})?" /></xs:restriction></xs:simpleType></xs:schema>',
        schemajson: null,
        arraypaths: [],
        view: 'annotation_comment',
        edit: 'annotation_comment_edit'
    },
    {
        guid: 'fdfc39f7-ec30-0640-b40b-8d0b78cf8032',
        name: 'LARM.radio.fil',
        schemaxml: '<xsd:schema attributeFormDefault="unqualified" elementFormDefault="qualified" version="1.0" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><xsd:element name="file"><xsd:complexType><xsd:sequence><xsd:element name="name" type="xsd:string" /><xsd:element name="relativePath" type="xsd:string" /></xsd:sequence></xsd:complexType></xsd:element></xsd:schema>',
        schemajson: null,
        arraypaths: [],
        view: '',
        edit: ''
    }

];

