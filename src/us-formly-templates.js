angular.module('usFormlyTemplates', [
	'formly',
	'formlyBootstrap'
])
.run(function(formlyConfig, formlyValidationMessages) {
	formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';
	formlyValidationMessages.messages.required = 'to.label + " é obrigatório"';
	formlyValidationMessages.messages.maxlength = '"Máximo de " + to.maxlength + " caracteres"';
	formlyValidationMessages.addStringMessage('email', 'E-mail inválido');
	formlyValidationMessages.addStringMessage('number', 'Apenas números');
})
.config(['formlyConfigProvider',
	function(formlyConfigProvider) {

		//Validação
		formlyConfigProvider.setWrapper({
    		name: 'validation',
    		types: ['input', 'maskedInput', 'cpf', 'rg', 'cnpj', 'number', 'maxlength', 'fone', 'percent', 'decimal', 'textarea'],
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
    		template: '<input class="form-control" model-view-value="true" ng-model="model[options.key]" />',
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

		//CPF
		formlyConfigProvider.setType({
    		name: 'cpf',
    		extends: 'maskedInput',
    		defaultOptions: {
				validators: {
		        	cpf: {
		            	expression: function(viewValue, modelValue, scope) {
							var cpf = modelValue || viewValue;
							if(cpf){
        						cpf = cpf.replace(/\.|\-/g, '');
								if (cpf.length != 11 ||
								cpf == "00000000000" ||
								cpf == "11111111111" ||
								cpf == "22222222222" ||
								cpf == "33333333333" ||
								cpf == "44444444444" ||
								cpf == "55555555555" ||
								cpf == "66666666666" ||
								cpf == "77777777777" ||
								cpf == "88888888888" ||
								cpf == "99999999999")
									return false;

								var add = 0;

						        for (var i = 0; i < 9; i++)
						            add += parseInt(cpf.charAt(i)) * (10 - i);
						        var rev = 11 - (add % 11);
						        if (rev == 10 || rev == 11)
						            rev = 0;
						        if (rev != parseInt(cpf.charAt(9)))
						            return false;
						        add = 0;
						        for (i = 0; i < 10; i++)
						            add += parseInt(cpf.charAt(i)) * (11 - i);
						        rev = 11 - (add % 11);
						        if (rev == 10 || rev == 11)
						            rev = 0;
						        if (rev != parseInt(cpf.charAt(10)))
						            return false;

						        return true;
							} else if (!scope.to.required) {
        						return true;
    						}
							return false;
		            	},
		            	message: '"CPF inválido"'
		        	}
		        },
        		templateOptions: {
        			mask: '999.999.999-99'
    			}
    		}
    	});

		//RG
		formlyConfigProvider.setType({
    		name: 'rg',
    		//extends: 'maskedInput',
    		extends: 'input',
    		defaultOptions: {
       			templateOptions: {
       				//mask: '99.999.999-9',
       				maxlength: 18
    			}
    		}
    	});

		//CNPJ
		formlyConfigProvider.setType({
    		name: 'cnpj',
    		extends: 'maskedInput',
    		defaultOptions: {
				validators: {
		        	cnpj: {
		            	expression: function(viewValue, modelValue, scope) {
							var cnpj = modelValue || viewValue;
							if(cnpj){
								cnpj = cnpj.replace(/[^\d]+/g,'');
							    if (cnpj == "00000000000000" ||
						        cnpj == "11111111111111" ||
						        cnpj == "22222222222222" ||
						        cnpj == "33333333333333" ||
						        cnpj == "44444444444444" ||
						        cnpj == "55555555555555" ||
						        cnpj == "66666666666666" ||
						        cnpj == "77777777777777" ||
						        cnpj == "88888888888888" ||
						        cnpj == "99999999999999")
							        return false;

							    var tamanho = cnpj.length - 2
							    var numeros = cnpj.substring(0,tamanho);
							    var digitos = cnpj.substring(tamanho);
							    var soma = 0;
							    var pos = tamanho - 7;
							    for (var i = tamanho; i >= 1; i--) {
							    	soma += numeros.charAt(tamanho - i) * pos--;
							    	if (pos < 2)
							    		pos = 9;
							    }
							    var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
							    if (resultado != digitos.charAt(0))
							    	return false;

							    tamanho = tamanho + 1;
							    numeros = cnpj.substring(0,tamanho);
							    soma = 0;
							    pos = tamanho - 7;
							    for (var i = tamanho; i >= 1; i--) {
							    	soma += numeros.charAt(tamanho - i) * pos--;
							    	if (pos < 2)
							        	pos = 9;
							    }
							    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
							    if (resultado != digitos.charAt(1))
							        return false;

							    return true;
							} else if (!scope.to.required) {
        						return true;
    						}
							return false;
		            	},
		            	message: '"CNPJ inválido"'
		        	}
		        },
        		templateOptions: {
        			mask: '99.999.999/9999-99'
    			}
    		}
    	});

		//CEP
		formlyConfigProvider.setType({
    		name: 'cep',
    		extends: 'maskedInput',
    		defaultOptions: {
        		templateOptions: {
        			mask: '99999-999'
    			}
    		}
    	});

		//Telefone
		formlyConfigProvider.setType({
    		name: 'fone',
    		extends: 'maskedInput',
    		defaultOptions: {
        		templateOptions: {
        			mask: '(99) 9999-9999?9'
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


		//Radio
		formlyConfigProvider.setType({
			name: 'radioDefault',
			extends: 'radio',
			template: `
			<div class="checkbox" ng-repeat="(key, option) in to.options">
				<label class="i-checks">
					<input
						type="radio"
						id="{{id + '_'+ $index}}"
						tabindex="0"
						ng-value="option[to.valueProp || 'value']"
						ng-model="model[options.key]">
					<i></i>{{option[to.labelProp || 'name']}}
				</label>
			</div>`,
			controller: function($scope){
				// console.log($scope.model[$scope.options.key]);
				if (!$scope.model[$scope.options.key]) {
					$scope.model[$scope.options.key] = $scope.to.checked;
				}
			}
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

		//Multi Checkbox
		formlyConfigProvider.setType({
			name: 'multiCheckboxDefault',
			extends: 'multiCheckbox',
			template: `
			<div class="checkbox" ng-repeat="(key, option) in to.options">
				<label class="i-checks">
					<input
						type="checkbox"
						id="{{id + '_'+ $index}}"
						ng-model="multiCheckbox.checked[$index]"
						ng-change="multiCheckbox.change()"
						ng-true-value="'{{to.trueValue || 1}}'"
       					ng-false-value="'{{to.falseValue || 0}}'">
					<i></i>
					{{option[to.labelProp || 'name']}}
				</label>
			</div>`
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
		            	ng-change="multiCheckbox.change()"
						ng-true-value="'{{to.trueValue || 1}}'"
       					ng-false-value="'{{to.falseValue || 0}}'">
					<i></i>
		    		{{option[to.labelProp || 'name']}}
		    	</label>
			</div>`
		});

		//Checkbox
		formlyConfigProvider.setType({
			name: 'usCheckbox',
			extends: 'checkbox',
			template: `
			<div class="checkbox">
            	<label class="i-checks">
        			<input
						type="checkbox"
						class="formly-field-checkbox"
						ng-model="model[options.key]"
						ng-true-value="'{{to.trueValue || 1}}'"
    					ng-false-value="'{{to.falseValue || 0}}'"
						ng-checked="model[options.key]">
					<i></i>
					{{to.label}}
					{{to.required ? '*' : ''}}
            	</label>
            </div>`,
			controller: ['$scope', function ($scope) {
    			if (!$scope.model[$scope.options.key]) {
    				$scope.model[$scope.options.key] = ($scope.to.falseValue) ? $scope.to.falseValue : 0;
    			}
			}]
		});

		//Percent
		formlyConfigProvider.setType({
			name: 'percent',
			extends: 'input',
			template: `
			<input
				ui-jq="TouchSpin"
				ng-model="model[options.key]"
				type="text"
				class="form-control"
				data-min='0'
				data-step="0.1"
				data-decimals="2"
				data-postfix="%">`
		});
		
		//Decimal
		formlyConfigProvider.setType({
			name: 'decimal',
			extends: 'input',
			template: `
			<input
				ng-model="model[options.key]"
				type="number"
				class="form-control"
				ng-pattern="{{to.pattern || '/^[0-9]+(\.[0-9]{1,2})?$/'}}"
				step="{{to.step || 0.01}}"
				decimals="{{to.decimals || 2}}"
				postfix="{{to.step || ''}}"
				required="{{to.required || false}}">`
		});

		// Select2
		formlyConfigProvider.setType({
			name: 'select2',
			extends: 'select',
			template: `
			<ui-select ng-model="model[options.key]" required="{{to.required}}" ng-disabled="to.disabled" theme="bootstrap">
        		<ui-select-match placeholder="{{to.placeholder}}" allow-clear="true">{{$select.selected[to.labelProp]}}</ui-select-match>
        		<ui-select-choices repeat="option[to.valueProp] as option in to.options | filter: $select.search">
        			<div ng-bind-html="option[to.labelProp] | highlight: $select.search"></div>
        		</ui-select-choices>
    		</ui-select>`
		});

		// MultiSelect2
		formlyConfigProvider.setType({
			name: 'multiselect2',
			extends: 'select',
			template: `
			<ui-select multiple ng-model="model[options.key]" required="{{to.required}}" ng-disabled="to.disabled" theme="bootstrap">
        		<ui-select-match placeholder="{{to.placeholder}}">{{$item[to.labelProp]}}</ui-select-match>
        		<ui-select-choices repeat="option[to.valueProp] as option in to.options | filter: $select.search">
          			<div ng-bind-html="option[to.labelProp] | highlight: $select.search"></div>
        		</ui-select-choices>
      		</ui-select>`
		});

		//Typeahead
		formlyConfigProvider.setType({
			name: 'typeahead',			
			template: `
				<input 
				type="text" 
				ng-model="model[options.key]" 
				typeahead="item for item in to.options | filter:$viewValue | limitTo:8" 
				class="form-control"
				autocomplete="off">`,
			wrapper: ['bootstrapLabel', 'bootstrapHasError']
		});

		//Datepicker
		formlyConfigProvider.setType({
	    	name: 'datepicker',
	    	template:  `
			<p class="input-group">
			<input
				type="text"
				ng-model="model[options.key]"
				class="form-control"
				ng-click="datepicker.open($event)"
				ng-disabled="to.disabled"
				datepicker-popup="{{to.datepickerOptions.format}}"
				is-open="datepicker.opened"
				datepicker-options="to.datepickerOptions" />
				<span class="input-group-btn">
					<button
						type="button"
						class="btn btn-default btn-sm"
						ng-click="datepicker.open($event)"
						ng-disabled="to.disabled">
						<i class="glyphicon glyphicon-calendar"></i>
					</button>
				</span>
			</p>`,
	    	wrapper: ['bootstrapLabel', 'bootstrapHasError'],
	    	defaultOptions: {	    		
	    		templateOptions: {
	        		datepickerOptions: {
	        			format: 'dd/MM/yyyy'	        			
	        		}
	    		}
	    	},
	    	controller: ['$scope', function ($scope) {
	    		$scope.datepicker = {};	    			    	
	    		$scope.datepicker.opened = false;

	    		$scope.datepicker.open = function ($event) {
	        		$scope.datepicker.opened = true;
	    		};

				// carregamento com abas
				$scope.$watch('model.'+$scope.options.key, function(value) {
					if (typeof ($scope.model[$scope.options.key]) == 'string') {
						$scope.model[$scope.options.key] = new Date($scope.model[$scope.options.key]);
					}
				});
	    	}]
		});

		//Image Upload
		formlyConfigProvider.setType({
			name: 'imageUpload',
			extends: 'input',
			template: `
			<div class="col-md-12">
				<div class="form-group">
					<label>{{to.label}}</label>
					<input type="file" us-file-upload="fileUpload" ng-model="model[options.key]"/>
				</div>
				<div class="hbox hbox-auto-xs">
					<div class="col">
						<div class="wrapper-sm b-a bg-white m-r-xs m-b-xs">
							<div class="bg-light" style="height:200px">
								<img-crop
									image="fileUpload"
									result-image="myCroppedImage"
									result-image-size="160"
									area-type="{{cropType}}">
								</img-crop>
							</div>
						</div>
					</div>
					<div class="col">
						<div class="inline bg-white wrapper-sm b-a">
							<div class="bg-light">
								<img ng-src="{{myCroppedImage}}" />
							</div>
						</div>
					</div>
				</div>
				<div class="btn-group m-t">
					<label class="btn btn-default" ng-model="cropType" btn-radio="'circle'">Circulo</label>
					<label class="btn btn-default" ng-model="cropType" btn-radio="'square'">Quadrado</label>
				</div>
			</div>`,
			wrapper: ['bootstrapHasError'],
			controller: ['$scope', function ($scope) {
				$scope.myCroppedImage = '';
				$scope.cropType = "circle";
	    	}]
		});
	}
])
.directive('usFileUpload', function() {
	return {
		restrict: 'A',
      	require: 'ngModel',
      	scope: {
        	usFileUpload: '='
      	},
      	link(scope, element) {
        	element.on('change', function(e) {
          		if (!e.target.files || !e.target.files[0]) {
            		return;
          		};
				var reader = new FileReader();
				reader.onload = function (evt) {
					scope.$apply(function(scope) {
						scope.usFileUpload = evt.target.result;
					});
				};
				reader.readAsDataURL(e.target.files[0]);
        	});
    	}
	};
});
