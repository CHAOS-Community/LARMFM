define(function () {

    var callbacks = [];
    var callbackData = [];

    function metadataReceived(data) {
        var r = data.Body.Results[0];
        doCallback(r.Id, r);
    }

    function createObjectReceived(data) {
        var i = 0;
    }

    function createAnnotationReceived(data) {

    }

    function createAnnotationReceived_relation(data) {

    }

    function createAnnotationReceived_metadata(data) {

    }

    function doCallback(guid, param) {
        var cb = callbacks[guid];
        if (cb !== undefined) {
            while (cb.length > 0) {
                cb.shift()(param);
            }

            if (cb.length == 0)
                delete callbacks[guid];
        }
    }

    function generateGUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
    }

    function pushCallback(guid, callback) {
        if (callbacks[guid] === undefined) {
            callbacks[guid] = [];
        }
        callbacks[guid].push(callback);
    }

    // --- CREATE ANNOTATION begin
    var CreateAnnotation = function (guid, parentGuid, schemaGuid, lang, metadata, callback) {
        this.guid = guid;
        this.parentGuid = parentGuid;
        this.schemaGuid = schemaGuid;
        this.lang = lang;
        this.metadata = metadata;
        this.callback = callback;
        this.relationdone = false;
        this.metadatadone = false;
        this.publishdone = false;
    };

    CreateAnnotation.prototype.create = function () {
        //Object.Create(guid, objectTypeID, folderID, serviceCaller)
        CHAOS.Portal.Client.Object.Create(this.guid, 64, 717, null).WithCallbackAndToken(this.createReceived, this);
    };

    CreateAnnotation.prototype.createReceived = function (data, self) {
        if (data.Error !== null || data.Body.Count < 1) {
            // Show error!
            return;
        }
        // ObjectRelation.Set(object1Guid, object2Guid, objectRelationTypeID, sequence, metadataGuid, metadataSchemaGuid, languageCode, metadataXml, serviceCaller)

        var preday = new Date();
        preday.setDate(preday.getDate() - 5);
        // public static SetPublishSettings(objectGUID: string, accessPointGUID: string, startDate: Date, endDate: Date, serviceCaller: CHAOS.Portal.Client.IServiceCaller = null): ICallState<any>
        CHAOS.Portal.Client.Object.SetPublishSettings(self.guid, Settings.accessPointGuid, preday).WithCallbackAndToken(self.setPublishSettingsReceived, self);


        CHAOS.Portal.Client.ObjectRelation.Set
            (self.parentGuid, self.guid, 16).WithCallbackAndToken(self.relationReceived, self);
    };

    CreateAnnotation.prototype.setPublishSettingsReceived = function (data, self) {
        self.publishdone = true;
        self.createDone(self);
    };

    CreateAnnotation.prototype.relationReceived = function (data, self) {
        self.relationdone = true;

        if (!self.metadatadone) {
            // Metadata.Set(objectGuid, metadataSchemaGuid, languageCode, revisionID, metadataXml, serviceCaller)
            CHAOS.Portal.Client.Metadata.Set(
                self.guid, self.schemaGuid, self.lang,
                0, self.metadata, null).WithCallbackAndToken(self.metadataReceived, self);
        }

        self.createDone(self);
    };

    CreateAnnotation.prototype.metadataReceived = function (data, self) {
        self.metadatadone = true;
        self.createDone(self);
    };

    CreateAnnotation.prototype.createDone = function (self) {
        if (self.relationdone && self.metadatadone && self.publishdone) {
            self.callback();
        }
    }

    // --- CREATE ANNOTATION end

    // --- Public properties and methods ---
    return {
        //-------------------------------------------------
        generateGUID: generateGUID,
        //-------------------------------------------------
        getByGuid: function (guid, callback) {

            pushCallback(guid, callback);

            // Object.Get
            // ---------------------------------------------------------
            // objectGuids,accessPointGuid,
            // includeMetadata, includeFiles, includeObjectRelations, 
            // includeFolders, includeAccessPoints, pageSize, pageIndex, 
            // serviceCaller
            var guids = [];
            guids.push(guid);
            CHAOS.Portal.Client.Object.Get(
                guids, Settings.accessPointGuid,
                true, true, true,
                false, false, 1, 0,
                null).WithCallback(metadataReceived);
            //CHAOS.Portal.Client.Object.Get(
            //    guids, null,
            //    true, true, true,
            //    false, false, 1, 0,
            //    null).WithCallback(metadataReceived);
        },
        //-------------------------------------------------
        createObject: function (callback) {
            var guid = generateGUID();
            pushCallback(guid, callback);
            //Object.Create(guid, objectTypeID, folderID, serviceCaller)
            CHAOS.Portal.Client.Object.Create(guid, 64, 717, null).WithCallback(createObjectReceived);
        },
        //-------------------------------------------------
        createAnnotation: function (parentGuid, schemaGuid, lang, metadata, callback) {
            var guid = generateGUID();
            var createAnn = new CreateAnnotation(guid, parentGuid, schemaGuid, lang, metadata, callback);
            createAnn.create();
        }
        //-------------------------------------------------
    };
});