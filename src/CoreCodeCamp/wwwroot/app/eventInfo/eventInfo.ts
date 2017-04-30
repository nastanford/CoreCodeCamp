﻿///<reference path="../common/dataService.ts" />
module CodeCamp {

  // External JS Libraries
  declare var Vue: any;
  declare var moment: any;

  export function eventInfo() {
    CodeCamp.App.bootstrap(CodeCamp.EventInfoView);
  }

  export let EventInfoView = {
    el: "#event-info-view",
    data: {
      busy: true,
      theEvent: {},
      errorMessage: "",
      eventMessage: "",
      locationMessage: "",
      rooms: [],
      timeSlots: [],
      tracks: [],
      newRoom: "",
      newTrack: "",
      newTimeSlot: ""
    },
    methods: {
      onSaveEvent() {
        this.$validator.validateAll("theEvent").then(result => {
          if (result) {
            this.busy = true;
            this.eventMessage = "";
            this.$dataService.saveEventInfo(this.theEvent).then(function () {
              this.eventMessage = "Saved...";
            }, function () {
              this.eventMessage = "Failed to save changes...";
            }).finally(() => this.busy = false);
          }
        });
        return false;
      },
      onSaveLocation() {
        this.$validator.validateAll("vLocation").then(result => {
          if (result) {
            this.busy = true;
            this.locationMessage = "";
            this.$dataService.saveEventLocation(this.theEvent.location).then(function () {
              this.locationMessage = "Saved...";
            }, function () {
              this.locationMessage = "Failed to save changes...";
            }).finally(() => this.busy = false);
          }
        });
        return false;
      },
      onValidateForm(scope) {
        this.$validator.validateAll(scope).then(result => {
        });
        return false;
      }
    },
    computed: {
      eventDate: {
        get: function () {
          return moment(this.theEvent.eventDate).format("MM-DD-YYYY");
        },
        set: function (newValue) {
          var newDate = moment(newValue, "MM-DD-YYYY");
          if (newDate.isValid()) {
            this.theEvent.eventDate = newDate;
          }
        }
      },
      callForSpeakersClosed: {
        get: function () {
          return moment(this.theEvent.callForSpeakersOpened).format("MM-DD-YYYY");
        },
        set: function (newValue) {
          var newDate = moment(newValue, "MM-DD-YYYY");
          if (newDate.isValid()) {
            this.theEvent.callForSpeakersOpened = newDate;
          }
        }
      },
      callForSpeakersOpened: {
        get: function () {
          return moment(this.theEvent.callForSpeakersOpened).format("MM-DD-YYYY");
        },
        set: function (newValue) {
          var newDate = moment(newValue, "MM-DD-YYYY");
          if (newDate.isValid()) {
            this.theEvent.callForSpeakersOpened = newDate;
          }
        }
      }
    },
    mounted() {
      this.$dataService = new CodeCamp.Common.DataService(this.$http);
      Vue.Promise.all([
        this.$dataService.getEventInfo(),
        this.$dataService.getTimeSlots(),
        this.$dataService.getRooms(),
        this.$dataService.getTracks()
      ])
        .then(function (result) {
          this.theEvent = result[0].data;
          this.timeSlots = result[1].data;
          this.rooms = result[2].data;
          this.tracks = result[3].data;
        }.bind(this), function () {
          this.errorMessage = "Failed to load data";
        }.bind(this))
        .finally(function () {
          this.busy = false;
          this.$validator.validateAll('vEvent').then(() => { }).catch(() => { });
          this.$validator.validateAll('vLocation').then(() => { }).catch(() => { });
        }.bind(this));

    }
  };
}

