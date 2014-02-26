define([
    'durandal/app', 'knockout', 'mods/player', 'mods/timeline',
    'mods/format', 'factory/metadata', 'mods/objectmanager',
    'mods/xmlmanager', 'mods/metadataschema', 'mods/metadataviewbuilder',
    'bootstrap','mods/mdannotationline'
],
        function (
            app, ko, player, timeline,
            format, metadatafac, objectmanager,
            xmlman, metadataschema, html, bootstrap, mdannotationline
            ) {

            var anncomment = function () {
                this.data = null;
                this.annotation = new mdannotationline.MDAnnotationLine();
                //this.title = ko.observable("");
                //this.starttime = ko.observable("");
                //this.endtime = ko.observable("");
                //this.collapsed = ko.observable(true);
                this.player = player;
                this.timeline = timeline;
                this.ismouseover = false;
                this.isPlayBtnVisible = ko.observable(false);
                //this.author = ko.observable("");
                //this.date = ko.observable("");

                this.mdhtml = ko.observableArray();
                this.isLoading = ko.observable(false);
            };

            anncomment.prototype = (function () {
                return {

                    annotation: this.annotation,

                    compositionComplete: function (child, parent, settings) {
                        this.annotation.init(settings, this);
                        //settings.bindingContext.$data.data["self"] = this;
                        //// settings.bindingContext.$data represents an
                        //// instance of MetadataEditor under factory.
                        ////settings.bindingContext.$data.data
                        //this.data = settings.bindingContext.$data.data;

                        //this.annotation.init(this.data);

                        //this.title(this.data.Title);
                        //this.annotation.title(this.data.Title);

                        //var tla = timeline.getAnnotation(this.data.Id);
                        //this.starttime(format.getTimeStringFromDate(tla[0].v));
                        //this.endtime(format.getTimeStringFromDate(tla[1].v));

                        //this.author(this.data.EditingUser);
                        //this.date(new Date(this.data.DateModified).toLocaleString());
                        
                    },
                    btnedit: function (data) {
                        this.annotation.collapsed(true);
                        var i = 0;
                        //parentcontext.$data.entereditmode(this);
                        this.timeline.editItem(data.data.Id);
                        app.trigger('metadata:edit', this);
                        //app.trigger('metadata:changedinview', this);
                    },
                    btnexpand: function () {
                        this.annotation.collapsed(!this.annotation.collapsed());

                        if (this.annotation.collapsed() === false) {

                            this.isLoading(true);
                            objectmanager.getByGuid(this.data.Id, this.metadataReceived, this);

                        }

                        this.togglePlayBtnVisibility();

                    },
                    metadataReceived: function (param, self) {
                        var i = 0;
                        for (var i = 0; i < param.Metadatas.length; i++) {
                            if (param.Metadatas[i].MetadataSchemaGuid == self.data.MetadataSchemaGUID) {

                                var d = param.Metadatas[i];
                                var xml = xmlman.parseXml(d.MetadataXml);
                                var schema = metadataschema.getMetadataSchemaByGuid(d.MetadataSchemaGuid);
                                var json = xmlman.toJson(schema.arraypaths, xml)

                                var p = self.mdhtml;
                                var d = json["LARM.Annotation.Comment"];

                                p.removeAll();
                                html.mdtext(p, "!md_title", d.Title);
                                html.mdtext(p, "!md_description", d.Description);

                                break;
                            }
                        }
                        self.isLoading(false);
                    },
                    mouseover: function (e, c) {
                        this.ismouseover = (c.type === "mouseover");
                        this.togglePlayBtnVisibility();
                    },
                    togglePlayBtnVisibility: function () {
                        if (this.annotation.collapsed() === false) {
                            this.isPlayBtnVisible(true);
                        }
                        else {
                            this.isPlayBtnVisible(this.ismouseover);
                        }
                    },
                    optionclick: function (param, data, context) {
                        if (param === "Edit") {
                            this.btnedit(data);
                        }
                    }

                };
            })();

            //editor2.prototype.compositionComplete = function (child, parent, settings) {
            //    // settings.bindingContext.$data represents an
            //    // instance of MetadataEditor under factory.
            //    this.data = settings.bindingContext.$data.data;
            //    this.title(this.data.title);
            //};

            return anncomment;

        });
