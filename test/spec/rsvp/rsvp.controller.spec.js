/**
 * Created by Kelvin on 6/28/2016.
 */
'use strict';
describe('Controller: RSVPCtrl', function () {
    // load the controller's module
    beforeEach(module('tiffanyAndKelvin'));
    beforeEach(module('templates'));

    var RSVPCtrl,
        scope,
        rootScope,
        deferred;

    var rsvpData = {
        data: {}
    };

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, $q) {
        rootScope = $rootScope;
        scope = $rootScope.$new();
        deferred = $q.defer();
        var promise = deferred.promise;
        rsvpData.save = function(formModel) {
            return promise;
        };

        rsvpData.pepe = 'test';

        RSVPCtrl = $controller('RSVPCtrl', {
            rsvpData: rsvpData
        });
        spyOn(rsvpData, 'save').and.callThrough();
        spyOn($.fn, 'removeClass');
    }));

    it('should initialize isSaving to false', function() {
        expect(RSVPCtrl.isSaving).toBe(false);
    });

    it('should initialize showCloseButton to true', function() {
        expect(RSVPCtrl.showCloseButton).toBe(true);
    });

    it('should initialize form to an empty object', function() {
        var expected = {};
        expect(RSVPCtrl.form).toEqual(expected);
    });

    it('should set formModel to be rsvpData.data', function() {
       expect(RSVPCtrl.formModel).toEqual(rsvpData.data);
    });

    it('should return whether a given property on form is dirty and invalid', function() {
        var element = 'foo';
        var idx = 'bar';
        RSVPCtrl.form.foobar = {
            $dirty: true,
            $invalid: false
        };
        var expected = false;
        var actual = RSVPCtrl.showErrors(element, idx);
        expect(actual).toBe(expected);
    });

    describe('closeToast', function() {
        it('should set showCloseButton to true when called', function() {
            RSVPCtrl.showCloseButton = false;
            RSVPCtrl.closeToast();
            expect(RSVPCtrl.showCloseButton).toBe(true);
        });

        it('should call removeClass with show-up', function() {
            RSVPCtrl.closeToast('success');
            expect($.fn.removeClass).toHaveBeenCalledWith('show-up');
        });
    });

    describe('submit', function() {
        var formModel =  {
            code: 'foo'
        };

        beforeEach(function() {
            RSVPCtrl.submit(formModel);
            spyOn($.fn, 'addClass');
        });

        it('should call save on rsvpData', function() {
           expect(rsvpData.save).toHaveBeenCalledWith(formModel);
        });

        it('should call add class with show-up when successful', function() {
            deferred.resolve();
            scope.$apply();
            expect($.fn.addClass).toHaveBeenCalledWith('show-up');
        });

        it('should call add class with show-up when not successful', function() {
            deferred.reject();
            scope.$apply();
            expect($.fn.addClass).toHaveBeenCalledWith('show-up');
        });

        it('should set showCloseButton false when the promise completes', function() {
            deferred.reject();
            scope.$apply();
            expect(RSVPCtrl.showCloseButton).toBe(false);
        });

        it('should set isSaving to true', function() {
            expect(RSVPCtrl.isSaving).toBe(true);
        });

        it('should set isSaving to false when the promise finishes', function() {
            deferred.reject();
            scope.$apply();
            expect(RSVPCtrl.isSaving).toBe(false);
        });
    });


});