define(['durandal/app', 'knockout', 'mods/xmlmanager', 'mods/metadataschema'], function (app, ko, xmlman, metadataschema) {


    var larmprogram = function () {
        this.data = null;
        this.mdTitle = ko.observable("");
        this.mdAbstract = ko.observable("");
        this.mdDescription = ko.observable("");
        this.mdChannel = ko.observable("");
        this.mdStartDate = ko.observable("");
        this.mdEndDate = ko.observable("");

        this.mdPublisher = ko.observable("");
        this.mdSubjects = ko.observableArray([]);

        this.mdContributors = ko.observableArray([]);

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
                        "<Creators /><Locations /><Identifiers><DR.ProductionNumber /><DR.ArchiveNumber>2023</DR.ArchiveNumber><SB.DomsID /></Identifiers></Larm.Program>";
                    //"<Contributor><Name></Name><RoleName></RoleName><RoleID></RoleID></Contributor>" +
                    // ---

                    self.m1 = handlexml(metadata[i]);
                    
                    self.mdTitle(self.m1.Larm_Program.Title);

                    self.mdAbstract(self.m1.Larm_Program.Abstract);
                    self.mdDescription(self.m1.Larm_Program.Description);
                    self.mdChannel(self.m1.Larm_Program.PublicationChannel);
                    self.mdPublisher(self.m1.Larm_Program.Publisher);

                    for (var i = 0; i < self.m1.Larm_Program.Subjects.Subject.length; i++) {
                        self.mdSubjects.push(self.m1.Larm_Program.Subjects.Subject[i]);
                    }

                    //if (self.m1.Larm_Program.Contributors.length > 0) {
                        for (var i = 0; i < self.m1.Larm_Program.Contributors.Contributor.length; i++) {
                            var c = self.m1.Larm_Program.Contributors.Contributor[i];
                            self.mdContributors.push(
                                {
                                    Name: ko.observable(c.Name),
                                    RoleID: ko.observable(c.RoleID),
                                    RoleName: ko.observable(c.RoleName)
                                });
                        }
                    //}

                    self.mdStartDate(self.m1.Larm_Program.PublicationDateTime);
                    self.mdEndDate(self.m1.Larm_Program.PublicationEndDateTime);

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



