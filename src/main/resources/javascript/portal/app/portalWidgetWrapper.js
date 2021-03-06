Jahia = Jahia || [];
Jahia.Portal = Jahia.Portal || [];

Jahia.Portal.AdvancedWidgetWrapper = function (widgetIdentifier, editable, haveFullView, deleteConfirmMessage, deleteConfirmMessageRef) {
    var instance = this;
    this._minimize = false;
    this.widgetIdentifier = widgetIdentifier;
    this.widget = {};
    this.$widget = {};
    this.editable = editable;
    this.isModel = portal.isModel;
    this.haveFullView = haveFullView;
    this.deleteConfirmDelete = deleteConfirmMessage;
    this.deleteConfirmDeleteRef = deleteConfirmMessageRef;

    $(document).ready(function(){
        instance.init("w" + widgetIdentifier);
    });
};

Jahia.Portal.AdvancedWidgetWrapper.prototype = {
    init: function (widgetId) {
        var instance = this;
        instance.widget = portal.getCurrentWidget(widgetId);
        instance.$widget = instance.widget.getjQueryWidget();
        if(instance.editable){
            instance.switchEditViewListener();
            instance.deleteListener();
        }
        if(instance.widget._portal.fullTemplate){
            instance.switchFullStateListener();
        }
        if(instance.isModel && instance.editable){
            $(".model_switch").show();
            instance.switchModelViewListener();
        }else{
            $(".model_switch").hide();
        }
        instance.minimizeListener();
    },

    switchEditViewListener: function() {
        var instance = this;
        instance.$widget.find(".edit_switch").on("click", function(){
            instance._switchView("portal.edit");
        });
    },

    switchModelViewListener: function() {
        var instance = this;
        instance.$widget.find(".model_switch").on("click", function(){
            instance._switchView("portal.model");
        });
    },

    _switchView: function(view){
        var instance = this;
        if (instance.widget._currentView != view) {
            instance.widget.load(view);
        } else {
            instance.widget.load();
        }
    },

    switchFullStateListener: function() {
        var instance = this;
        var resizeSwitch = instance.$widget.find(".resize_switch");

        if(instance.widget._state == "full"){
            resizeSwitch.addClass("glyphicon glyphicon-resize-small");
        }else {
            resizeSwitch.addClass("glyphicon glyphicon-resize-full");
        }

        resizeSwitch.on("click", function(){
            if(instance.widget._state != "full"){
                portal.loadInCurrentTab(instance.widget._jcrIdentifier, instance.haveFullView ? "portal.full" : "portal.view", "full", true, instance.widget._portal.fullTemplate);
            }else {
                portal.loadInCurrentTab();
            }
        });
    },

    deleteListener: function () {
        var instance = this;
        instance.$widget.find(".delete_action").on("click", function(){
            if(instance.widget._isReference){
                if(confirm(instance.deleteConfirmDeleteRef)){
                    portal.deleteWidget(instance.widget);
                }
            }else {
                if(confirm(instance.deleteConfirmDelete)){
                    portal.deleteWidget(instance.widget);
                }
            }
        });
    },

    minimizeListener: function () {
        var instance = this;
        instance.$widget.find(".minimize_action").on("click", function(){
            instance._minimize = !instance._minimize;
            if(instance._minimize){
                $(this).removeClass("glyphicon glyphicon-minus");
                $(this).addClass("glyphicon glyphicon-plus");
            }else {
                $(this).removeClass("glyphicon glyphicon-plus");
                $(this).addClass("glyphicon glyphicon-minus");
            }
            instance.$widget.find(".widget-content").toggle();
        });
    }
};


