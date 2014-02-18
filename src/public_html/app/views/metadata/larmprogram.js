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

            var larm_program = metadataschema.getMetadataSchemaByName("Larm.Program");
            var larm_metadata = metadataschema.getMetadataSchemaByName("LARM.Metadata");
            var larm_program_guid = larm_program.guid;
            var larm_metadata_guid = larm_metadata.guid;

            var arkiv = null;
            var larm = null;
            var p = self.mdhtml;

            for (var i = 0; i < metadata.length; i++) {
                if (metadata[i].MetadataSchemaGuid == larm_metadata_guid) {

                    // --- TEST DATA
                    //metadata[i].MetadataXml =
                    //    "<Larm.Metadata>" +
                    //    "<Title>Dramatisk forum - Poul Reumert</Title>" +
                    //    "<Description>Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat. Curabitur augue lorem, dapibus quis, laoreet et, pretium ac, nisi. Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci. In hac habitasse platea dictumst.</Description>" +
                    //    "<Genre>svendborg politi kontor banegård</Genre>" +
                    //    "<Subjects>svendborg politi kontor banegård</Subjects>" +
                    //    "<Tags>svendborg politi kontor banegård</Tags>" +
                    //    "<Note>Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.</Note>" +
                    //    "<RelatedObjects>Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.</RelatedObjects>" +
                    //    "<Contributors>" +
                    //        "<Contributor><Name>Jan Laursen</Name><RoleName>Radiovært</RoleName><Subject>Nullam varius, turpis et commodo pharetra.</Subject></Contributor>" +
                    //        "<Contributor><Name>Benny Bidsk Jensen</Name><RoleName>Tekniker</RoleName><Subject>Nullam varius, turpis et commodo pharetra.</Subject></Contributor>" +
                    //        "<Contributor><Name>Bjarke Ahlstrand</Name><RoleName>Radiovært</RoleName><Subject>Nullam varius, turpis et commodo pharetra.</Subject></Contributor>" +
                    //    "</Contributors>" +
                    //    "</Larm.Metadata>";

                    self.m0 = handlexml(metadata[i]);
                    larm = self.m0.Larm_Metadata;


                }
                else if (metadata[i].MetadataSchemaGuid == larm_program_guid) {

                    // --- TEST DATA
                    //metadata[i].MetadataXml =
                    //    "<Larm.Program>" +
                    //    "<PublicationDateTime>0101-01-01T00:00:00</PublicationDateTime><PublicationEndDateTime>0101-01-01T00:08:50</PublicationEndDateTime>" +
                    //    "<PublicationChannel>DR P1</PublicationChannel>" +
                    //    "<Title>Tysk propaganda-udsendelse - Reportage fra østfronten</Title>" +
                    //    "<Abstract>Søren Aabye Kierkegaard (5. maj 1813 – 11. november 1855) var en dansk teolog og filosof. Kierkegaard regnes ofte som den største danske filosof og som fader til eksistentialismen. Efter Jean-Paul Sartre og den ateistiske eksistentialisme benævnes Kierkegaard dog ofte som hovedskikkelse i den kristne eksistentialisme.</Abstract>" +
                    //    "<Description>Det er karakteristisk, at værkerne fra forfatterskabets første fase er udgivet under pseudonymer. I Efterskriften vedkender Kierkegaard sig samtlige sine værker. Ved hjælp af pseudonymerne lader han de teologiske, filosofiske og psykologiske temaer spille dialektisk mod hinanden på en måde, som har gjort ham til en af eksistentialismens fædre. Pseudonymerne har netop gjort, at forståelsen af hans værker blev op til 'hiin Enkelte', fordi argumentationen 'ikke' var fremført af Kierkegaard selv. Han udgav samtidig en række religiøse 'taler', som blev samlet i 1845 under titlen Atten opbyggelige Taler. Han udgav dem under eget navn for at vise, at han først og fremmest opfattede sig selv som religiøs og kristelig forfatter. I den sidste periode – kirkestormen – kaldte han hele sit tidligere forfatterskab for 'en digters politieklogskab' der skulle gøre de mennesker, han nu angreb, nemlig præsterne, trygge, sådan som politiet gør det for at se dybere i tingene.[1] Han betragtes også som en af den danske guldalders hovedpersoner.</Description>" +
                    //    "<Publisher>DR</Publisher>" +
                    //    "<Subjects><Subject>Radio</Subject><Subject>Dronning Margrethe 2.</Subject></Subjects>" +
                    //    "<Contributors>" +
                    //        "<Contributor><Name>Jan Laursen</Name><RoleName>Radiovært</RoleName><RoleID>1</RoleID></Contributor>" +
                    //        "<Contributor><Name>Benny Bidsk Jensen</Name><RoleName>Tekniker</RoleName><RoleID>2</RoleID></Contributor>" +
                    //        "<Contributor><Name>Bjarke Ahlstrand</Name><RoleName>Radiovært</RoleName><RoleID>3</RoleID></Contributor>" +
                    //    "</Contributors>" +
                    //    "<Creators>" +
                    //        "<Creator><Name>Jan Laursen</Name><RoleName>Radiovært</RoleName><RoleID>1</RoleID></Creator>" +
                    //        "<Creator><Name>Benny Bidsk Jensen</Name><RoleName>Tekniker</RoleName><RoleID>2</RoleID></Creator>" +
                    //        "<Creator><Name>Bjarke Ahlstrand</Name><RoleName>Radiovært</RoleName><RoleID>3</RoleID></Creator>" +
                    //    "</Creators>" +
                    //    "<Locations><Name>Svendborg</Name><Name>Svendborg havn</Name><Name>Svendborg banegård</Name></Locations>" +
                    //    "<Identifiers><DR.ProductionNumber>666-666-6666</DR.ProductionNumber><DR.ArchiveNumber>2023</DR.ArchiveNumber><SB.DomsID>99</SB.DomsID></Identifiers></Larm.Program>";


                    self.m1 = handlexml(metadata[i]);

                    arkiv = self.m1.Larm_Program;

                    self.mdTitle(arkiv.Title);
                    self.mdAbstract(arkiv.Abstract);
                    self.mdDescription(arkiv.Description);
                    self.mdChannel(arkiv.PublicationChannel);

                    self.mdStartDate(arkiv.PublicationDateTime);
                    self.mdEndDate(arkiv.PublicationEndDateTime);
                }
            }

            // Generate HTML
            html.mdheadline(p, "ARKIV METADATA");
            html.mdtext(p, "!md_abstract", arkiv.Abstract);
            html.mdtext(p, "!md_description", arkiv.Description);
            html.mdtext(p, "!md_publisher", arkiv.Publisher);

            html.mdtags(p, "!md_subjects", arkiv.Subjects);

            html.mdtable(p, "!md_contributors",
                arkiv.Contributors,
                ['Name', 'RoleName', 'RoleID'],
                ['Name', 'RoleName', 'RoleID']);

            html.mdtable(p, "!md_creators",
                arkiv.Creators,
                ['Name', 'RoleName', 'RoleID'],
                ['Name', 'RoleName', 'RoleID']);

            html.mdtags(p, "!md_locations", arkiv.Locations[0], "Name");

            html.mdgrid(p, "!md_identifiers", [
            ["DR produktionsnr:", arkiv.Identifiers.DR_ProductionNumber],
            ["DR arkivnr:", arkiv.Identifiers.DR_ArchiveNumber],
            ["SB Doms nr:", arkiv.Identifiers.SB_DomsID]
            ]);

            html.mdheadline(p, "LARM METADATA");
            html.mdtext(p, "Title", larm.Title);
            html.mdtext(p, "Description", larm.Description);
            html.mdtags(p, "Genre", larm.Genre);
            html.mdtags(p, "Subjects", larm.Subjects);
            html.mdtags(p, "Tags", larm.Tags);
            html.mdtext(p, "Note", larm.Note);
            html.mdtext(p, "Related Objects", larm.RelatedObjects);

            html.mdtable(p, "!md_contributors",
                larm.Contributors,
                ['Name', 'RoleName', 'Subject'],
                ['Name', 'RoleName', 'Subject']);

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



