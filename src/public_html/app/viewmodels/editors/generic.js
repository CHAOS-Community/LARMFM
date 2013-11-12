﻿define(['knockout', 'mods/xmlmanager', 'mods/metadataschema'], function (ko, xmlman, metadataschema) {

    var data;
    function init() {
        var jsonschemaDATA = { "Duration": 33, "ModuleResults": [{ "Fullname": "MCM", "Duration": 0, "Count": 13, "TotalCount": null, "PageIndex": null, "TotalPages": null, "Results": [{ "GUID": "00000000-0000-0000-0000-0000dd820000", "Name": "Larm.FileInfos", "SchemaXML": "<xs:schema attributeFormDefault=\"unqualified\" elementFormDefault=\"qualified\" xmlns:xs=\"http:\/\/www.w3.org\/2001\/XMLSchema\"><xs:element name=\"Larm.FileInfos\"><xs:complexType><xs:sequence><xs:element maxOccurs=\"unbounded\" name=\"Larm.FileInfo\"><xs:complexType><xs:sequence><xs:element name=\"StartOffSetMS\" type=\"xs:unsignedInt\" \/><xs:element name=\"EndOffSetMS\" type=\"xs:unsignedInt\" \/><xs:element name=\"FileName\" type=\"xs:string\" \/><xs:element name=\"Index\" type=\"xs:unsignedByte\" \/><\/xs:sequence><\/xs:complexType><\/xs:element><\/xs:sequence><\/xs:complexType><\/xs:element><\/xs:schema>", "DateCreated": 1335205890, "FullName": "CHAOS.MCM.Data.Dto.Standard.MetadataSchema" }, { "GUID": "00000000-0000-0000-0000-0000df820000", "Name": "Larm.Program", "SchemaXML": "<xs:schema attributeFormDefault=\"unqualified\" elementFormDefault=\"qualified\" xmlns:xs=\"http:\/\/www.w3.org\/2001\/XMLSchema\"><xs:element name=\"Larm.Program\"><xs:complexType><xs:sequence><xs:element name=\"PublicationDateTime\" type=\"xs:dateTime\" \/><xs:element name=\"PublicationEndDateTime\" type=\"xs:dateTime\" \/><xs:element name=\"PublicationChannel\" type=\"xs:string\" \/><xs:element name=\"Title\" type=\"xs:string\" \/><xs:element name=\"Abstract\" type=\"xs:string\" \/><xs:element name=\"Description\" type=\"xs:string\" \/><xs:element name=\"Publisher\" type=\"xs:string\" \/><xs:element name=\"Subjects\"><xs:complexType><xs:sequence><xs:element name=\"Subject\" type=\"xs:string\" minOccurs=\"0\" maxOccurs=\"unbounded\" \/><\/xs:sequence><\/xs:complexType><\/xs:element><xs:element name=\"Contributors\"><xs:complexType><xs:sequence><xs:element name=\"Contributor\" minOccurs=\"0\" maxOccurs=\"unbounded\"><xs:complexType><xs:sequence><xs:element name=\"Name\" type=\"xs:string\" \/><xs:element name=\"RoleName\" type=\"xs:string\" \/><xs:element name=\"RoleID\" type=\"xs:string\" \/><\/xs:sequence><\/xs:complexType><\/xs:element><\/xs:sequence><\/xs:complexType><\/xs:element><xs:element name=\"Creators\"><xs:complexType><xs:sequence><xs:element name=\"Creator\" minOccurs=\"0\" maxOccurs=\"unbounded\"><xs:complexType><xs:sequence><xs:element name=\"Name\" type=\"xs:string\" \/><xs:element name=\"RoleName\" type=\"xs:string\" \/><xs:element name=\"RoleID\" type=\"xs:string\" \/><\/xs:sequence><\/xs:complexType><\/xs:element><\/xs:sequence><\/xs:complexType><\/xs:element><xs:element name=\"Locations\"><xs:complexType><xs:sequence><xs:element name=\"Name\" type=\"xs:string\" minOccurs=\"0\" maxOccurs=\"unbounded\" \/><\/xs:sequence><\/xs:complexType><\/xs:element><xs:element name=\"Identifiers\"><xs:complexType><xs:sequence><xs:element name=\"DR.ProductionNumber\" type=\"xs:string\" \/><xs:element name=\"DR.ArchiveNumber\" type=\"xs:string\" \/><xs:element name=\"SB.DomsID\" type=\"xs:string\" \/><\/xs:sequence><\/xs:complexType><\/xs:element><\/xs:sequence><\/xs:complexType><\/xs:element><\/xs:schema>", "DateCreated": 1335205890, "FullName": "CHAOS.MCM.Data.Dto.Standard.MetadataSchema" }, { "GUID": "00000000-0000-0000-0000-0000e4820000", "Name": "Larm.CommentInfos", "SchemaXML": "<xs:schema attributeFormDefault=\"unqualified\" elementFormDefault=\"qualified\" xmlns:xs=\"http:\/\/www.w3.org\/2001\/XMLSchema\"><xs:element name=\"Larm.CommentInfos\"><xs:complexType><xs:sequence><xs:element name=\"CommentInfo\"><xs:complexType><xs:sequence><xs:element name=\"UserGUID\" type=\"xs:string\" \/><xs:element name=\"CreateDate\" type=\"xs:dateTime\" \/><xs:element name=\"Title\" type=\"xs:string\" \/><xs:element name=\"Description\" type=\"xs:string\" \/><xs:element name=\"StartTimeMS\" type=\"xs:unsignedByte\" \/><xs:element name=\"EndTimeMS\" type=\"xs:unsignedByte\" \/><\/xs:sequence><\/xs:complexType><\/xs:element><\/xs:sequence><\/xs:complexType><\/xs:element><\/xs:schema>", "DateCreated": 1335205890, "FullName": "CHAOS.MCM.Data.Dto.Standard.MetadataSchema" }, { "GUID": "17d59e41-13fb-469a-a138-bb691f13f2ba", "Name": "LARM.Metadata", "SchemaXML": "<xs:schema attributeFormDefault=\"unqualified\" elementFormDefault=\"qualified\" xmlns:xs=\"http:\/\/www.w3.org\/2001\/XMLSchema\"><xs:element name=\"Larm.Metadata\"><xs:complexType><xs:sequence><xs:element name=\"Title\" type=\"xs:string\" \/><xs:element name=\"Description\" type=\"xs:string\" \/><xs:element name=\"Genre\" type=\"OpenEnumerationList_Tags\" \/><xs:element name=\"Subjects\" type=\"OpenEnumerationList_Tags\" \/><xs:element name=\"Tags\" type=\"OpenEnumerationList_Tags\" \/><xs:element name=\"Note\" type=\"xs:string\" \/><xs:element name=\"RelatedObjects\" type=\"xs:string\" \/><xs:element name=\"Contributors\"><xs:complexType><xs:sequence><xs:element name=\"Contributor\" minOccurs=\"0\" maxOccurs=\"unbounded\"><xs:complexType><xs:sequence><xs:element name=\"Name\" type=\"xs:string\" \/><xs:element name=\"RoleName\" type=\"xs:string\" \/><xs:element name=\"Subject\" type=\"xs:string\" \/><\/xs:sequence><\/xs:complexType><\/xs:element><\/xs:sequence><\/xs:complexType><\/xs:element><\/xs:sequence><\/xs:complexType><\/xs:element><xs:simpleType name=\"OpenEnumerationList_Tags\"><xs:list itemType=\"xs:string\" \/><\/xs:simpleType><\/xs:schema>", "DateCreated": 1354200629, "FullName": "CHAOS.MCM.Data.Dto.Standard.MetadataSchema" }, { "GUID": "1fd4e56e-3f3a-4f25-ba3e-3d9f80d5d49e", "Name": "CHAOS.Profile", "SchemaXML": "<xs:schema attributeFormDefault=\"unqualified\" elementFormDefault=\"qualified\" xmlns:xs=\"http:\/\/www.w3.org\/2001\/XMLSchema\"><xs:element name=\"CHAOS.Profile\"><xs:complexType><xs:sequence><xs:element name=\"Name\" type=\"xs:string\" \/><xs:element name=\"Title\" type=\"xs:string\" \/><xs:element name=\"Organization\" type=\"xs:string\" \/><xs:element name=\"About\" type=\"xs:string\" \/><xs:element name=\"Emails\"><xs:complexType><xs:sequence><xs:element maxOccurs=\"unbounded\" name=\"Email\" type=\"xs:string\" \/><\/xs:sequence><\/xs:complexType><\/xs:element><xs:element name=\"Phonenumbers\"><xs:complexType><xs:sequence><xs:element maxOccurs=\"unbounded\" name=\"Phonenumber\" type=\"xs:string\" \/><\/xs:sequence><\/xs:complexType><\/xs:element><xs:element name=\"Websites\"><xs:complexType><xs:sequence><xs:element maxOccurs=\"unbounded\" name=\"Website\" type=\"xs:string\" \/><\/xs:sequence><\/xs:complexType><\/xs:element><xs:element name=\"Skype\" type=\"xs:string\" \/><xs:element name=\"LinkedIn\" type=\"xs:string\" \/><xs:element name=\"Twitter\" type=\"xs:string\" \/><xs:element name=\"Address\" type=\"xs:string\" \/><xs:element name=\"City\" type=\"xs:string\" \/><xs:element name=\"Zipcode\" type=\"xs:unsignedInt\" \/><xs:element name=\"Country\" type=\"xs:string\" \/><\/xs:sequence><\/xs:complexType><\/xs:element><\/xs:schema>", "DateCreated": 1340267971, "FullName": "CHAOS.MCM.Data.Dto.Standard.MetadataSchema" }, { "GUID": "25d4b87b-606e-4595-80f4-0765c5eb6be6", "Name": "LARM.Annotation.WP5.8.2.Jingles", "SchemaXML": "<xs:schema elementFormDefault=\"qualified\" xmlns:xs=\"http:\/\/www.w3.org\/2001\/XMLSchema\"><xs:element name=\"LARM.Annotation.WP5.8.2.Jingles\"><xs:complexType><xs:complexContent><xs:extension base=\"TimedAnnotation\"><xs:sequence><xs:element name=\"Title\" type=\"OpenEnumerationList_WP582_Title\" \/><xs:element name=\"Tags\" type=\"OpenEnumerationList_WP582_Tags\" \/><xs:element name=\"Classification\" type=\"Enumeration_Classification\" \/><xs:element name=\"JingleID\" type=\"OpenEnumerationList_WP582_Jingle\" \/><xs:element name=\"FromPeriod\" type=\"xs:dateTime\" \/><xs:element name=\"ToPeriod\" type=\"xs:dateTime\" \/><xs:element name=\"ComponistType\" type=\"Enumeration_ComponistType\" \/><xs:element name=\"ComponistName\" type=\"xs:string\" \/><xs:element name=\"SourceType\" type=\"Enumeration_SourceType\" \/><xs:element name=\"SourceMusicTitle\" type=\"xs:string\" \/><xs:element name=\"CreatorMusic\" type=\"xs:string\" \/><xs:element name=\"DescriptionMusic\" type=\"xs:string\" \/><xs:element name=\"SpeakTranscribe\" type=\"xs:string\" \/><xs:element name=\"SpeakDescription\" type=\"xs:string\" \/><xs:element name=\"SoundType\" type=\"EnumerationList_SoundType\" \/><xs:element name=\"SoundTags\" type=\"OpenEnumerationList_WP582_SoundTags\" \/><xs:element name=\"MusicStyleTags\" type=\"OpenEnumerationList_WP582_MusicStyleTags\" \/><xs:element name=\"ProgramGenre\" type=\"OpenEnumerationList_WP582_ProgramGenre\" \/><xs:element name=\"JingleVariant\" type=\"xs:string\" \/><xs:element name=\"MixTypeIn\" type=\"Enumeration_MixTypeIn\" \/><xs:element name=\"MixTypeOut\" type=\"Enumeration_MixTypeOut\" \/><xs:element name=\"MixTypeSoundLevel\" type=\"Enumeration_MixTypeSoundLevel\" \/><\/xs:sequence><\/xs:extension><\/xs:complexContent><\/xs:complexType><\/xs:element><xs:simpleType name=\"OpenEnumerationList_WP582_Title\"><xs:list itemType=\"xs:string\" \/><\/xs:simpleType><xs:simpleType name=\"OpenEnumerationList_WP582_Tags\"><xs:list itemType=\"xs:string\" \/><\/xs:simpleType><xs:simpleType name=\"OpenEnumerationList_WP582_Jingle\"><xs:list itemType=\"xs:string\" \/><\/xs:simpleType><xs:simpleType name=\"OpenEnumerationList_WP582_SoundTags\"><xs:list itemType=\"xs:string\" \/><\/xs:simpleType><xs:simpleType name=\"OpenEnumerationList_WP582_MusicStyleTags\"><xs:list itemType=\"xs:string\" \/><\/xs:simpleType><xs:simpleType name=\"OpenEnumerationList_WP582_ProgramGenre\"><xs:list itemType=\"xs:string\" \/><\/xs:simpleType><xs:simpleType name=\"Enumeration_Classification\"><xs:restriction base=\"xs:string\"><xs:enumeration value=\"Intro\" \/><xs:enumeration value=\"Skiller\" \/><xs:enumeration value=\"Outro\" \/><xs:enumeration value=\"Station ID\" \/><xs:enumeration value=\"Andet\" \/><\/xs:restriction><\/xs:simpleType><xs:simpleType name=\"Enumeration_SourceType\"><xs:restriction base=\"xs:string\"><xs:enumeration value=\"Musik\" \/><xs:enumeration value=\"Medieklip\" \/><xs:enumeration value=\"Andet\" \/><\/xs:restriction><\/xs:simpleType><xs:simpleType name=\"Enumeration_ComponistType\"><xs:restriction base=\"xs:string\"><xs:enumeration value=\"Person\" \/><xs:enumeration value=\"Redaktion\" \/><xs:enumeration value=\"Ukendt\" \/><\/xs:restriction><\/xs:simpleType><xs:simpleType name=\"EnumerationList_SoundType\"><xs:restriction base=\"xs:string\"><xs:enumeration value=\"Musikinstrument\" \/><xs:enumeration value=\"Andre lydkilder\" \/><\/xs:restriction><\/xs:simpleType><xs:simpleType name=\"Enumeration_MixTypeOut\"><xs:restriction base=\"xs:string\"><xs:enumeration value=\"Fader ud\" \/><xs:enumeration value=\"Klippes ud\" \/><xs:enumeration value=\"Krydsfades ud\" \/><xs:enumeration value=\"Fades til baggrund\" \/><xs:enumeration value=\"Ophører\" \/><\/xs:restriction><\/xs:simpleType><xs:simpleType name=\"Enumeration_MixTypeIn\"><xs:restriction base=\"xs:string\"><xs:enumeration value=\"Fader ind\" \/><xs:enumeration value=\"Klippes ind\" \/><xs:enumeration value=\"Krydsfades ind\" \/><xs:enumeration value=\"Fades op fra baggrund\" \/><xs:enumeration value=\"Opstår\" \/><\/xs:restriction><\/xs:simpleType><xs:simpleType name=\"Enumeration_MixTypeSoundLevel\"><xs:restriction base=\"xs:string\"><xs:enumeration value=\"Forgrund\" \/><xs:enumeration value=\"Mellemgrund\" \/><xs:enumeration value=\"Baggrund\" \/><\/xs:restriction><\/xs:simpleType><xs:complexType name=\"TimedAnnotation\"><xs:attribute name=\"StartTime\" type=\"TimeSpan\" use=\"required\" \/><xs:attribute name=\"EndTime\" type=\"TimeSpan\" use=\"required\" \/><\/xs:complexType><xs:simpleType name=\"TimeSpan\"><xs:restriction base=\"xs:string\"><xs:pattern value=\"(d+.)?dd:dd:dd(.d{7})?\" \/><\/xs:restriction><\/xs:simpleType><\/xs:schema>", "DateCreated": 1361901376, "FullName": "CHAOS.MCM.Data.Dto.Standard.MetadataSchema" }, { "GUID": "50ad46c4-eaf1-42f6-9361-3f6b56c5f320", "Name": "LARM.Annotation.WP5.8.1.LydkildeBeskrivelse", "SchemaXML": "<xs:schema elementFormDefault=\"qualified\" xmlns:xs=\"http:\/\/www.w3.org\/2001\/XMLSchema\"><xs:element name=\"LARM.Annotation.WP5.8.1.LydkildeBeskrivelse\"><xs:complexType><xs:complexContent><xs:extension base=\"TimedAnnotation\"><xs:sequence><xs:element name=\"SoundSourceName\" type=\"xs:string\" \/><xs:element name=\"Tags\" type=\"OpenEnumerationList_Tags\" \/><xs:element name=\"MixTypeIn\" type=\"Enumeration_MixTypeIn\" \/><xs:element name=\"MixTypeOut\" type=\"Enumeration_MixTypeOut\" \/><xs:element name=\"MixTypeSoundLevel\" type=\"Enumeration_MixTypeSoundLevel\" \/><xs:element name=\"SoundType\" type=\"EnumerationList_SoundType\" \/><xs:element name=\"Anchorage\" type=\"Enumeration_Anchorage\" \/><xs:element name=\"Description\" type=\"xs:string\" \/><\/xs:sequence><\/xs:extension><\/xs:complexContent><\/xs:complexType><\/xs:element><xs:simpleType name=\"OpenEnumerationList_Tags\"><xs:list itemType=\"xs:string\" \/><\/xs:simpleType><xs:simpleType name=\"Enumeration_MixTypeOut\"><xs:restriction base=\"xs:string\"><xs:enumeration value=\"Fader ud\" \/><xs:enumeration value=\"Klippes ud\" \/><xs:enumeration value=\"Krydsfades ud\" \/><xs:enumeration value=\"Ophører\" \/><\/xs:restriction><\/xs:simpleType><xs:simpleType name=\"Enumeration_MixTypeIn\"><xs:restriction base=\"xs:string\"><xs:enumeration value=\"Fader ind\" \/><xs:enumeration value=\"Klippes ind\" \/><xs:enumeration value=\"Krydsfades ind\" \/><xs:enumeration value=\"Opstår\" \/><\/xs:restriction><\/xs:simpleType><xs:simpleType name=\"Enumeration_MixTypeSoundLevel\"><xs:restriction base=\"xs:string\"><xs:enumeration value=\"Forgrund\" \/><xs:enumeration value=\"Mellemgrund\" \/><xs:enumeration value=\"Baggrund\" \/><\/xs:restriction><\/xs:simpleType><xs:simpleType name=\"EnumerationList_SoundType\"><xs:list itemType=\"SoundTypeList\" \/><\/xs:simpleType><xs:simpleType name=\"SoundTypeList\"><xs:restriction base=\"xs:string\"><xs:enumeration value=\"Reallyd\" \/><xs:enumeration value=\"Effektlyd\" \/><xs:enumeration value=\"Scenografisk lyd\" \/><\/xs:restriction><\/xs:simpleType><xs:simpleType name=\"Enumeration_Anchorage\"><xs:restriction base=\"xs:string\"><xs:enumeration value=\"Rumlig forankring\" \/><xs:enumeration value=\"Semantisk forankring\" \/><xs:enumeration value=\"Rytmisk forankring\" \/><xs:enumeration value=\"Montage\" \/><xs:enumeration value=\"Tematisk forankring\" \/><\/xs:restriction><\/xs:simpleType><xs:complexType name=\"TimedAnnotation\"><xs:attribute name=\"StartTime\" type=\"TimeSpan\" use=\"required\" \/><xs:attribute name=\"EndTime\" type=\"TimeSpan\" use=\"required\" \/><\/xs:complexType><xs:simpleType name=\"TimeSpan\"><xs:restriction base=\"xs:string\"><xs:pattern value=\"(d+.)?dd:dd:dd(.d{7})?\" \/><\/xs:restriction><\/xs:simpleType><\/xs:schema>", "DateCreated": 1351691862, "FullName": "CHAOS.MCM.Data.Dto.Standard.MetadataSchema" }, { "GUID": "63fe50ba-ca9c-45a4-97fd-7ff9ed5de022", "Name": "LARM.AttachedFileInfo", "SchemaXML": "<xs:schema attributeFormDefault=\"unqualified\" elementFormDefault=\"qualified\" xmlns:xs=\"http:\/\/www.w3.org\/2001\/XMLSchema\"><xs:element name=\"LARM.AttachedFileInfo\"><xs:complexType><xs:sequence><xs:element name=\"Title\" type=\"xs:string\" \/><xs:element name=\"Description\" type=\"xs:string\" \/><xs:element name=\"FilesizeKB\" type=\"xs:int\" \/><\/xs:sequence><\/xs:complexType><\/xs:element><\/xs:schema>", "DateCreated": 1366299682, "FullName": "CHAOS.MCM.Data.Dto.Standard.MetadataSchema" }, { "GUID": "70c26faf-b1ee-41e8-b916-a5a16b25ca69", "Name": "OCR", "SchemaXML": "<xs:schema xmlns:xs=\"http:\/\/www.w3.org\/2001\/XMLSchema\" attributeFormDefault=\"unqualified\" elementFormDefault=\"qualified\"><xs:element name=\"Larm.HvideProgram\"><xs:complexType><xs:sequence><xs:element name=\"Titel\" type=\"xs:string\" \/><xs:element name=\"Filename\" type=\"xs:string\" \/><xs:element name=\"AllText\" type=\"xs:string\" \/><xs:element name=\"Date\" type=\"xs:dateTime\" \/><xs:element name=\"Type\" type=\"xs:string\" \/><\/xs:sequence><\/xs:complexType><\/xs:element><\/xs:schema>", "DateCreated": 1339010849, "FullName": "CHAOS.MCM.Data.Dto.Standard.MetadataSchema" }, { "GUID": "7e08dbc3-c60c-4b42-bcd8-8d0ed8dbba36", "Name": "LARM.radio", "SchemaXML": "<xsd:schema attributeFormDefault=\"unqualified\" elementFormDefault=\"qualified\" version=\"1.0\" xmlns:xsd=\"http:\/\/www.w3.org\/2001\/XMLSchema\"><xsd:element name=\"metadata\"><xsd:complexType><xsd:sequence><xsd:element name=\"titel\" type=\"xsd:string\" \/><xsd:element name=\"varighed\" type=\"xsd:string\" \/><xsd:element name=\"serietitel\" type=\"xsd:string\" \/><xsd:element name=\"producenter\"><xsd:complexType><xsd:sequence><xsd:element maxOccurs=\"unbounded\" name=\"producent\" type=\"xsd:string\" \/><\/xsd:sequence><\/xsd:complexType><\/xsd:element><xsd:element name=\"beskrivelse\" type=\"xsd:string\" \/><xsd:element name=\"tags\"><xsd:complexType><xsd:sequence><xsd:element maxOccurs=\"unbounded\" name=\"tag\" type=\"xsd:string\" \/><\/xsd:sequence><\/xsd:complexType><\/xsd:element><\/xsd:sequence><\/xsd:complexType><\/xsd:element><\/xsd:schema>", "DateCreated": 1366107319, "FullName": "CHAOS.MCM.Data.Dto.Standard.MetadataSchema" }, { "GUID": "d35d2637-e0d3-439c-9b61-94221853989b", "Name": "LARM.AnnotationCount", "SchemaXML": "<xs:schema attributeFormDefault=\"unqualified\" elementFormDefault=\"qualified\" xmlns:xs=\"http:\/\/www.w3.org\/2001\/XMLSchema\"><xs:element name=\"LARM.AnnotationCount\"><xs:complexType><xs:sequence><xs:element name=\"TotalCount\" type=\"xs:unsignedByte\" \/><\/xs:sequence><\/xs:complexType><\/xs:element><\/xs:schema>", "DateCreated": 1360253301, "FullName": "CHAOS.MCM.Data.Dto.Standard.MetadataSchema" }, { "GUID": "f9f6edd0-f0ca-41ac-b8b3-b0d950fdef4e", "Name": "LARM.Annotation.Comment", "SchemaXML": "<xs:schema id=\"LARM.Annotation.Comment\" elementFormDefault=\"qualified\" xmlns:xs=\"http:\/\/www.w3.org\/2001\/XMLSchema\"><xs:element name=\"LARM.Annotation.Comment\"><xs:complexType><xs:complexContent><xs:extension base=\"TimedAnnotation\"><xs:sequence><xs:element name=\"Title\" type=\"xs:string\" \/><xs:element name=\"Description\" type=\"xs:string\" \/><\/xs:sequence><\/xs:extension><\/xs:complexContent><\/xs:complexType><\/xs:element><xs:complexType name=\"TimedAnnotation\"><xs:attribute name=\"StartTime\" type=\"TimeSpan\" use=\"required\" \/><xs:attribute name=\"EndTime\" type=\"TimeSpan\" use=\"required\" \/><\/xs:complexType><xs:simpleType name=\"TimeSpan\"><xs:restriction base=\"xs:string\"><xs:pattern value=\"(d+.)?dd:dd:dd(.d{7})?\" \/><\/xs:restriction><\/xs:simpleType><\/xs:schema>", "DateCreated": 1354201967, "FullName": "CHAOS.MCM.Data.Dto.Standard.MetadataSchema" }, { "GUID": "fdfc39f7-ec30-0640-b40b-8d0b78cf8032", "Name": "LARM.radio.fil", "SchemaXML": "<xsd:schema attributeFormDefault=\"unqualified\" elementFormDefault=\"qualified\" version=\"1.0\" xmlns:xsd=\"http:\/\/www.w3.org\/2001\/XMLSchema\"><xsd:element name=\"file\"><xsd:complexType><xsd:sequence><xsd:element name=\"name\" type=\"xsd:string\" \/><xsd:element name=\"relativePath\" type=\"xsd:string\" \/><\/xsd:sequence><\/xsd:complexType><\/xsd:element><\/xsd:schema>", "DateCreated": 1366281772, "FullName": "CHAOS.MCM.Data.Dto.Standard.MetadataSchema" }] }] };
        var jsondataDATA = { "Duration": 146, "ModuleResults": [{ "Fullname": "MCM", "Duration": 0, "Count": 1, "TotalCount": 1, "PageIndex": null, "TotalPages": null, "Results": [{ "GUID": "fc0f07ee-6ae1-0641-9eb5-56a6e21e6fa3", "ObjectTypeID": 24, "DateCreated": 1338450389, "Metadatas": [{ "GUID": "2f2eb0fc-fc5d-5e48-a23e-3c35cd928021", "EditingUserGUID": "9c528dc9-f838-4599-a9ae-732bc778cbd5", "LanguageCode": "en", "MetadataSchemaGUID": "d35d2637-e0d3-439c-9b61-94221853989b", "RevisionID": 1, "MetadataXML": "<LARM.AnnotationCount><TotalCount>0<\/TotalCount><\/LARM.AnnotationCount>", "DateCreated": 1366915686, "FullName": "CHAOS.MCM.Data.DTO.Metadata" }, { "GUID": "606e0374-0e1c-6140-9f9b-ac6debdabe95", "EditingUserGUID": "9c528dc9-f838-4599-a9ae-732bc778cbd5", "LanguageCode": "da", "MetadataSchemaGUID": "17d59e41-13fb-469a-a138-bb691f13f2ba", "RevisionID": 1, "MetadataXML": "<Larm.Metadata><Title><\/Title><Description>Test<\/Description><Genre><\/Genre><Subjects><\/Subjects><Tags><\/Tags><Note><\/Note><RelatedObjects><\/RelatedObjects><Contributors \/><\/Larm.Metadata>", "DateCreated": 1366915686, "FullName": "CHAOS.MCM.Data.DTO.Metadata" }, { "GUID": "cc73f454-169f-e44e-a3e7-10bbc3c115fd", "EditingUserGUID": "00000000-0000-0000-0000-000022040000", "LanguageCode": "da", "MetadataSchemaGUID": "00000000-0000-0000-0000-0000dd820000", "RevisionID": 1, "MetadataXML": "<Larm.FileInfos><Larm.FileInfo><StartOffSetMS>0<\/StartOffSetMS><EndOffSetMS>0<\/EndOffSetMS><FileName>drp3_91.700_DR-P3_pcm_20071121045601_20071122045501.mp3<\/FileName><Index>0<\/Index><\/Larm.FileInfo><\/Larm.FileInfos>", "DateCreated": 1338450389, "FullName": "CHAOS.MCM.Data.DTO.Metadata" }, { "GUID": "edbf4393-5848-094e-9fe1-301aff007d8d", "EditingUserGUID": "9c528dc9-f838-4599-a9ae-732bc778cbd5", "LanguageCode": "da", "MetadataSchemaGUID": "00000000-0000-0000-0000-0000df820000", "RevisionID": 1, "MetadataXML": "<Larm.Program><PublicationDateTime>2007-11-21T23:08:00<\/PublicationDateTime><PublicationEndDateTime>2007-11-22T01:03:00<\/PublicationEndDateTime><PublicationChannel>DR P3<\/PublicationChannel><Title>Århus By Night, fortsat<\/Title><Abstract><\/Abstract><Description><\/Description><Publisher>DR<\/Publisher><Subjects \/><Contributors \/><Creators \/><Locations \/><Identifiers><DR.ProductionNumber><\/DR.ProductionNumber><DR.ArchiveNumber><\/DR.ArchiveNumber><SB.DomsID>07faacb2-c209-425b-a4ee-8a95e6e5ccd4<\/SB.DomsID><\/Identifiers><\/Larm.Program>", "DateCreated": 1378383251, "FullName": "CHAOS.MCM.Data.DTO.Metadata" }], "Files": [{ "ID": 797661, "ParentID": null, "Filename": "drp3_91.700_DR-P3_pcm_20071121045601_20071122045501.mp3", "OriginalFilename": "drp3_91.700_DR-P3_pcm_20071121045601_20071122045501.mp3", "Token": "RTMP Streaming", "URL": "rtmp:\/\/hyperion.statsbiblioteket.dk:1936\/chaos?sessionID=39e82016-4f46-054e-9673-8e2b2d9a761a&objectID=fc0f07ee-6ae1-0641-9eb5-56a6e21e6fa3&includeFiles=true\/mp3:drp3_91.700_DR-P3_pcm_20071121045601_20071122045501.mp3", "FormatID": 49, "Format": "MP3 128 kbit CBR", "FormatCategory": "LARM", "FormatType": "Audio", "FullName": "CHAOS.MCM.Data.DTO.FileInfo" }, { "ID": 1694912, "ParentID": null, "Filename": "P3_logo.png", "OriginalFilename": "P3_logo.png", "Token": "HTTP Download", "URL": "http:\/\/s3-eu-west-1.amazonaws.com\/mcm\/LarmLogos\/P3_logo.png", "FormatID": 50, "Format": "PNG 330x99", "FormatCategory": "Thumbnail", "FormatType": "Image", "FullName": "CHAOS.MCM.Data.DTO.FileInfo" }], "ObjectRelations": [], "AccessPoints": [], "FullName": "CHAOS.MCM.Data.DTO.Object" }] }] };

        metadataschema.loadxmlschemas();
        var metadataschemaguid = data.metadataSchemaGuid(); //'00000000-0000-0000-0000-0000df820000';
        var schema = metadataschema.getMetadataSchemaByGuid(metadataschemaguid);
        if (schema == null)
            return;
        var jsonschema = schema.schemajson;
        var arraypaths = schema.arraypaths;
        jsonschema["value"] = null;
        jsonschema["onSubmit"] = null;

        var xmldata = data.metadata();
        /*
        var xmldata = null;
        var metadatas = jsondataDATA.ModuleResults[0].Results[0].Metadatas;
        for (var i = 0; i < metadatas.length; i++) {
            if (metadatas[i].MetadataSchemaGUID == metadataschemaguid) {
                xmldata = metadatas[i].MetadataXML;
            }
        }
        */

        if (xmldata != null) {
            // Replace . with _ inside tags (inside < and >).
            xmldata = xmldata.replace(/([<]+[/a-zA-Z]*)(\.)([/a-zA-Z]*[>]+)/gi, '$1_$3');

            var x2js = new X2JS({ arrayAccessFormPaths: arraypaths });
            var jsdata = x2js.xml_str2json(xmldata);
            jsonschema["value"] = jsdata;
        }

        jsonschema["onSubmit"] = function (errors, values) {
            if (errors) {
                $('#res').html('<p>I beg your pardon?</p>');
            }
            else {
                var metadata = {};

                // Fetch schema for the metadata
                var formTree = $('#form1').data('jsonform-tree');
                var schema = formTree.formDesc.schema.properties;

                for (var schemakey in schema) {
                    if (schema.hasOwnProperty(schemakey)) {
                        var props = schema[schemakey].properties;
                        var vals = values[schemakey];
                        metadata[schemakey] = {};
                        var md = metadata[schemakey];
                        for (var key in props) {
                            if (vals.hasOwnProperty(key)) {
                                md[key] = vals[key];
                            }
                            else {
                                if (props[key].type == "object") {
                                    md[key] = [];
                                }
                                else {
                                    md[key] = "";
                                }
                            }
                        }
                    }
                }

                var x2js = new X2JS();
                metadata = x2js.json2xml_str(metadata);
                metadata = metadata.replace(/([<]+[/a-zA-Z]*)(_)([/a-zA-Z]*[>]+)/gi, '$1.$3');
                $('#xmlres').val(metadata);
            }
        };

        $('#form1').jsonForm(jsonschema);

    }

    return {
        compositionComplete: function (child, parent, settings) {
            data = settings.bindingContext.$data;
            init();
        }
    };
});



