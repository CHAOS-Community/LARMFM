define(['durandal/app', 'knockout', 'mods/xmlmanager', 'mods/metadataschema', 'mods/metadataviewbuilder'], function (app, ko, xmlman, metadataschema, html) {


    var larmprogram = function () {
        this.data = null;
        this.mdTitle = ko.observable("");
        this.mdAbstract = ko.observable("");
        this.mdDescription = ko.observable("");
        this.mdChannel = ko.observable("");
        this.mdStartDate = ko.observable("");
        this.mdEndDate = ko.observable("");

        this.mdhtml = ko.observableArray([]);

        this.m0 = null;
        this.m1 = null;
    };

    larmprogram.prototype = (function () {

        function handlexml(d) {
            var xml = xmlman.parseXml(d.MetadataXml);
            var schema = metadataschema.getMetadataSchemaByGuid(d.MetadataSchemaGuid);
            var json = xmlman.toJson(schema.arraypaths, xml)
            return json;
        }

        function init(self) {

            metadataschema.loadxmlschemas();

            var metadata = self.data.Metadatas;
            // LARM.Metadata: 17d59e41-13fb-469a-a138-bb691f13f2ba
            // Larm.Program: 00000000-0000-0000-0000-0000df820000
            for (var i = 0; i < metadata.length; i++) {
                if (metadata[i].MetadataSchemaGuid == '17d59e41-13fb-469a-a138-bb691f13f2ba') {
                    self.m0 = handlexml(metadata[i]);

                }
                else if (metadata[i].MetadataSchemaGuid == '00000000-0000-0000-0000-0000df820000') {

                    // --- TEST DATA
                    metadata[i].MetadataXml =
                        "<Larm.Program>" +
                        "<PublicationDateTime>0101-01-01T00:00:00</PublicationDateTime><PublicationEndDateTime>0101-01-01T00:08:50</PublicationEndDateTime>" +
                        "<PublicationChannel>DR P1</PublicationChannel>" +
                        "<Title>Tysk propaganda-udsendelse - Reportage fra østfronten</Title>" +
                        "<Abstract>Søren Aabye Kierkegaard (5. maj 1813 – 11. november 1855) var en dansk teolog og filosof. Kierkegaard regnes ofte som den største danske filosof og som fader til eksistentialismen. Efter Jean-Paul Sartre og den ateistiske eksistentialisme benævnes Kierkegaard dog ofte som hovedskikkelse i den kristne eksistentialisme.</Abstract>" +
                        "<Description>Det er karakteristisk, at værkerne fra forfatterskabets første fase er udgivet under pseudonymer. I Efterskriften vedkender Kierkegaard sig samtlige sine værker. Ved hjælp af pseudonymerne lader han de teologiske, filosofiske og psykologiske temaer spille dialektisk mod hinanden på en måde, som har gjort ham til en af eksistentialismens fædre. Pseudonymerne har netop gjort, at forståelsen af hans værker blev op til 'hiin Enkelte', fordi argumentationen 'ikke' var fremført af Kierkegaard selv. Han udgav samtidig en række religiøse 'taler', som blev samlet i 1845 under titlen Atten opbyggelige Taler. Han udgav dem under eget navn for at vise, at han først og fremmest opfattede sig selv som religiøs og kristelig forfatter. I den sidste periode – kirkestormen – kaldte han hele sit tidligere forfatterskab for 'en digters politieklogskab' der skulle gøre de mennesker, han nu angreb, nemlig præsterne, trygge, sådan som politiet gør det for at se dybere i tingene.[1] Han betragtes også som en af den danske guldalders hovedpersoner.</Description>" +
                        "<Publisher>DR</Publisher>" +
                        "<Subjects><Subject>Radio</Subject><Subject>Dronning Margrethe 2.</Subject></Subjects>" +
                        "<Contributors>" +
                            "<Contributor><Name>Jan Laursen</Name><RoleName>Radiovært</RoleName><RoleID>1</RoleID></Contributor>" +
                            "<Contributor><Name>Benny Bidsk Jensen</Name><RoleName>Tekniker</RoleName><RoleID>2</RoleID></Contributor>" +
                            "<Contributor><Name>Bjarke Ahlstrand</Name><RoleName>Radiovært</RoleName><RoleID>3</RoleID></Contributor>" +
                        "</Contributors>" +
                        "<Creators>" +
                            "<Creator><Name>Jan Laursen</Name><RoleName>Radiovært</RoleName><RoleID>1</RoleID></Creator>" +
                            "<Creator><Name>Benny Bidsk Jensen</Name><RoleName>Tekniker</RoleName><RoleID>2</RoleID></Creator>" +
                            "<Creator><Name>Bjarke Ahlstrand</Name><RoleName>Radiovært</RoleName><RoleID>3</RoleID></Creator>" +
                        "</Creators>" +
                        "<Locations><Name>Svendborg</Name><Name>Svendborg havn</Name><Name>Svendborg banegård</Name></Locations>" +
                        "<Identifiers><DR.ProductionNumber>666-666-6666</DR.ProductionNumber><DR.ArchiveNumber>2023</DR.ArchiveNumber><SB.DomsID>99</SB.DomsID></Identifiers></Larm.Program>";
                    //"<Contributor><Name></Name><RoleName></RoleName><RoleID></RoleID></Contributor>" +
                    // ---

                    self.m1 = handlexml(metadata[i]);

                    var arkiv = self.m1.Larm_Program;

                    self.mdTitle(arkiv.Title);
                    self.mdAbstract(arkiv.Abstract);
                    self.mdDescription(arkiv.Description);
                    self.mdChannel(arkiv.PublicationChannel);

                    self.mdStartDate(arkiv.PublicationDateTime);
                    self.mdEndDate(arkiv.PublicationEndDateTime);

                    var p = self.mdhtml;
                    html.mdheadline(p, "ARKIV METADATA");
                    html.mdtext(p, "!md_abstract", arkiv.Abstract);
                    html.mdtext(p, "!md_description", arkiv.Description);
                    html.mdtext(p, "!md_publisher", arkiv.Publisher);
                    html.mdtags(p, "!md_subjects", arkiv.Subjects.Subject);

                    html.mdtable(p, "!md_contributors",
                        arkiv.Contributors.Contributor,
                        ['Name', 'RoleName', 'RoleID'],
                        ['Name', 'RoleName', 'RoleID']);

                    html.mdtable(p, "!md_creators",
                        arkiv.Creators.Creator,
                        ['Name', 'RoleName', 'RoleID'],
                        ['Name', 'RoleName', 'RoleID']);

                    html.mdtags(p, "!md_locations", arkiv.Locations[0].Name);

                    html.mdgrid(p, "!md_identifiers", [
                    ["DR produktionsnr:", arkiv.Identifiers.DR_ProductionNumber],
                    ["DR arkivnr:", arkiv.Identifiers.DR_ArchiveNumber],
                    ["SB Doms nr:", arkiv.Identifiers.SB_DomsID]
                    ]);

                    html.mdheadline(p, "LARM METADATA");

                }
            }
        }

        return {

            compositionComplete: function (child, parent, settings) {
                // settings.bindingContext.$data represents an
                // instance of MetadataEditor under factory.
                this.data = settings.bindingContext.$data.data;
                if (this.data === undefined)
                    return;

                init(this);
            },
            btnedit: function (data) {
                var i = 0;
                //parentcontext.$data.entereditmode(this);
                app.trigger('metadata:edit', this);
            }

        };
    })();

    return larmprogram;

});



