angular.module('usFormlyTemplates', ['formly', 'formlyBootstrap'])

.run(function(formlyConfig, formlyValidationMessages) {
	formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';
	formlyValidationMessages.messages.required = 'to.label + " é obrigatório"';
	formlyValidationMessages.addStringMessage('email', 'E-mail inválido');
})

.config(['formlyConfigProvider',
	function(formlyConfigProvider) {

		//Validação
		formlyConfigProvider.setWrapper({
    		name: 'validation',
    		types: ['input'],
    		template: `
			<formly-transclude></formly-transclude>
			<div ng-messages="fc.$error" ng-if="form.$submitted || options.formControl.$touched" class="error-messages">
				<div ng-message="{{ ::name }}" ng-repeat="(name, message) in ::options.validation.messages" class="message">{{ message(fc.$viewValue, fc.$modelValue, this)}}</div>
			</div>`
    	});

		//Máscaras
		formlyConfigProvider.setType({
    		name: 'maskedInput',
    		extends: 'input',
    		template: '<input class="form-control" ng-model="model[options.key]" />',
    		defaultOptions: {
				ngModelAttrs: {
        			mask: {
        				attribute: 'ui-mask'
        			},
        			maskPlaceholder: {
            			attribute: 'ui-mask-placeholder'
        			}
        		},
        		templateOptions: {
        			maskPlaceholder: ''
    			}
    		}
    	});

		//Switch
		formlyConfigProvider.setType({
			name: 'switch',
			extends: 'checkbox',
			template: `
			<div>
				<label>{{to.label}} {{to.required ? '*' : ''}}</label>
			</div>
			<label class="i-switch bg-info m-t-xs m-r">
				<input type="checkbox" ng-model="model[options.key]" ng-checked="to.checked">
				<i></i>
			</label>`
		});

		//Radio Inline
		formlyConfigProvider.setType({
			name: 'radioInline',
			extends: 'radio',
			template: `
			<div>
				<label class="radio-inline i-checks" ng-repeat="(key, option) in to.options">
					<input
						type="radio"
						id="{{id + '_'+ $index}}"
						tabindex="0"
						ng-value="option[to.valueProp || 'value']"
						ng-model="model[options.key]">
					<i></i>
					{{option[to.labelProp || 'name']}}
				</label>
			</div>`,
			controller: function($scope){
				// console.log($scope.model[$scope.options.key]);
				if (!$scope.model[$scope.options.key]) {
					$scope.model[$scope.options.key] = $scope.to.checked;
				}
			}
		});

		//Multi Checkbox Inline
		formlyConfigProvider.setType({
			name: 'multiCheckboxInline',
			extends: 'multiCheckbox',
			template: `
			<div>
				<label class="radio-inline i-checks" ng-repeat="(key, option) in to.options">
		    		<input
						type="checkbox"
		            	id="{{id + '_'+ $index}}"
		            	ng-model="multiCheckbox.checked[$index]"
		            	ng-change="multiCheckbox.change()">
					<i></i>
		    		{{option[to.labelProp || 'name']}}
		    	</label>
			</div>`
		});

		//Datepicker
		formlyConfigProvider.setType({
	    	name: 'datepicker',
	    	template:  `
			<p class="input-group">
			<input
				type="text"
				id="{{::id}}"
				name="{{::id}}"
				ng-model="model[options.key]"
				class="form-control"
				ng-click="datepicker.open($event)"
				datepicker-popup="{{to.datepickerOptions.format}}"
				is-open="datepicker.opened"
				datepicker-options="to.datepickerOptions" />
				<span class="input-group-btn">
					<button
						type="button"
						class="btn btn-default"
						ng-click="datepicker.open($event)">
						<i class="glyphicon glyphicon-calendar"></i>
					</button>
				</span>
			</p>`,
	    	wrapper: ['bootstrapLabel', 'bootstrapHasError'],
	    	defaultOptions: {
	    		templateOptions: {
	        		datepickerOptions: {
	        			format: 'dd.MM.yyyy',
	        			initDate: new Date()
	        		}
	    		}
	    	},
	    	controller: ['$scope', function ($scope) {
	    		$scope.datepicker = {};

	    		$scope.datepicker.opened = false;

	    		$scope.datepicker.open = function ($event) {
	        		$scope.datepicker.opened = true;
	    		};
	    	}]
		});
	}
]);
