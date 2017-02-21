var app = angular.module('lojaApp', ['ui.router','ui.bootstrap']);

//roteamento
app.config(['$stateProvider', '$urlRouterProvider',
	function ($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/home');
		$stateProvider
			.state('home', {
				url: "/home",
				templateUrl: "partials/home.html"
			})
			.state('login', {
				url: "/login",
				templateUrl: "partials/login.html"
			})
			.state('lojas', {
				url: "/lojas",
				templateUrl: "partials/lojas.html"
			})
			.state('register', {
				url: "/register",
				templateUrl: "partials/register.html"
			})
			.state('perfil', {
				url: "/perfil",
				templateUrl: "partials/perfil.html"
			})
			.state('meusProdutos', {
				url: "/meusProdutos",
				templateUrl: "partials/meusProdutos.html"
			})
			.state('novoProduto', {
				url: "/criar",
				templateUrl: "partials/novoProduto.html"
			})
			.state('editar', {
				url: "/editar",
				templateUrl: "partials/editarProduto.html"
			})
			.state('detalhes', {
				url: "/detalhes",
				templateUrl: "partials/detalhesProduto.html",
				css: ['public/detalhesProduto.css']
			})
			.state('visualizarProdutos', {
				url: "/visualizarProdutos",
				templateUrl: "partials/visualizarProdutos.html"
			})
	}
]);



app.service('loja', function () {
	var property = {};
	return {
		getProperty: function () {
			return property;
		},
		setProperty: function (value) {
			property = value;
		}
	};

});


app.service('categorias', function () {
	var categorias = [
		{nome:"Blusa", tamanhos:["36","38","40","42","44","46","48","50"]},
		{nome:"Calça", tamanhos:["36","38","40","42","44","46","48","50","52","54","56","58","60"]},
		{nome:"Casaco", tamanhos:["36","38","40","42","44","46","48","50"]},
		{nome:"Sobretudo", tamanhos:["36","38","40","42","44","46","48","50"]},
		{nome:"Saia", tamanhos:["36","38","40","42","44","46","48","50","52","54","56","58","60"]},
		{nome:"Vestido", tamanhos:["36","38","40","42","44","46","48","50","52","54","56","58","60"]},
		{nome:"Blazer",tamanhos:["36","38","40","42","44","46","48","50","52","54","56","58","60"]},
		{nome:"Gravata", tamanhos:["36","38","40","42","44","46","48","50","52","54","56","58","60"]},
		{nome:"Camisa", tamanhos:["36","38","40","42","44","46","48","50","52","54","56","58","60"]},
		{nome:"leggins", tamanhos:["36","38","40","42","44","46","48","50","52","54","56","58","60"]},
		{nome:"Cueca", tamanhos:["36","38","40","42","44","46","48","50"]},
		{nome:"Sutiâ", tamanhos:["55","60","65","70","75","80","85","90"]},
		{nome:"Pijama", tamanhos:["36","38","40","42","44","46","48","50","52","54","56","58","60"]},
		{nome:"Chapeu", tamanhos:["46","48","50","52","54"]},
		{nome:"Gorro", tamanhos:["46","48","50","52","54"]},
		{nome:"Sapato", tamanhos:["18","20","22","24","26","28","30","32","34","36","38","40","42","44","46","48","50","52"]},
		{nome:"Oculos", tamanhos:["54","55","56","57"]},
		{nome:"Bolsa", tamanhos:["36","38","40","42","44","46","48","50"]},
		{nome:"Cachecol", tamanhos:["36","38","40","42","44","46","48","50"]},
		{nome:"Cinto", tamanhos:["36","38","40","42","44","46","48","50"]}
	];
	return {
		getProperty: function () {
			return categorias;
		},
	};

});


app.factory('user', function () {
	var property = {};
	return {
		getProperty: function () {
			return property.nome;
		},
		setProperty: function (value) {
			property.nome = value;
		}
	};
});


app.factory('produto', function () {
	var property = {};
	return {
		getProperty: function () {
			return property.nome;
		},
		setProperty: function (value) {
			property.nome = value;
		}
	};

});



app.controller('MainCtrl', function ($scope, $state, $location, $http, user) {


    //esta sempre a verificar se existe a alteracao na variavel scope user
	$scope.$watch(function () { return localStorage.getItem("user"); }, updateProp, true);
	function updateProp(newValue, oldValue) {
		if (localStorage.getItem("user") === null) {
			$scope.user = {
				nome: undefined
			}
		}
		else {
			$scope.user = {
				nome: JSON.parse(newValue).nome,
				id: JSON.parse(newValue).id
			};
		}
	}

	$scope.showRegister = function () {
		$state.go('register');
	}

	$scope.showLogin = function () {
		$state.go('login');
	}

	$scope.showLojas = function () {
		$state.go('lojas');
	}

	$scope.showProducts = function () {
		$state.go('meusProdutos');
	}

	$scope.checkLogin = function () {
		if ($scope.user.nome != undefined) {
			return true;
		};
	}

	$scope.perfil = function () {
		$state.go('perfil');
	}

	$scope.logout = function () {
		localStorage.clear();
		$state.go("home");
	}

});

app.directive('equals', function() {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, elem, attrs, ngModel) {
      if(!ngModel) return; // do nothing if no ng-model

      // watch own value and re-validate on change
      scope.$watch(attrs.ngModel, function() {
        validate();
      });

      // observe the other value and re-validate on change
      attrs.$observe('equals', function (val) {
        validate();
      });

      var validate = function() {
        // values
        var val1 = ngModel.$viewValue;
        var val2 = attrs.equals;

        // set validity
        ngModel.$setValidity('equals', ! val1 || ! val2 || val1 === val2);
      };
    }
  }
});

app.controller('produtoController', function ($scope, $state, $http, user,categorias,multipartForm) {
	//foi necessária esta lógica pois ja tinha alguma lógica para as dropdowns, e depois de implementar o escopo das categorias era um objeto 
	$scope.produto = {};
	$scope.categorias = {};

	$scope.categorias = categorias.getProperty();


	$scope.adicionaProduto = function () {
		$scope.produtoAdicionar = {};
		$scope.produtoAdicionar.nome = $scope.produto.nome;
		$scope.produtoAdicionar.categoria = $scope.produto.categoria.nome;
		$scope.produtoAdicionar.descricao = $scope.produto.descricao;
		$scope.produtoAdicionar.preco = $scope.produto.preco;
		$scope.produtoAdicionar.stock = $scope.produto.stock;
		$scope.produtoAdicionar.tamanho = $scope.tamanho;
		$scope.produtoAdicionar.file = $scope.produto.file
		var userId = JSON.parse(localStorage.getItem("user")).id;
		var uploadUrl = 'http://localhost:8080/lojas/' + userId + '/produtos';
		multipartForm.post(uploadUrl, $scope.produtoAdicionar, function (data, status, headers, config) {
			if (status == 200) {
				$state.go('meusProdutos');
			}
			else {
				$scope.message = "impossível criar produto verifique se introduziu os dados corretamente !";
			}
		});

	}

	$scope.cancelar = function () {
		$state.go('meusProdutos');
	}

});


app.controller('visualizarProdutosController', function ($scope, $state, $http, user, categorias, loja, produto) {

	$scope.loja = {};
	$scope.loja = loja.getProperty();
	$scope.produtos = [];


	$http.get('http://localhost:8080/lojas/' + $scope.loja._id + '/produtos')
		.success(function (data) {
			console.log($scope.loja);
			for (var i in data) {
				if (data[i].hasOwnProperty('foto')) {
					data[i].foto.img = 'http://localhost:8080/' + data[i].foto.img;
					data[i].data = data[i].data.split('T')[0];
				}

				

			}
			console.log(data)
			$scope.produtos = data;
		})

		.error(function (statusText) {
			$scope.produtos = [];
		});

	$scope.visualizarProduto = function ($index) {
		produto.setProperty($scope.produtos[$index]);
		$state.go('detalhes');
	}

});


app.controller('perfilController', function ($scope, $state, $http, user, categorias, loja, produto) {

	$scope.loja = {};

	var userId = JSON.parse(localStorage.getItem("user")).id;


	$http.get('http://localhost:8080/lojas/' + userId)
		.success(function (data) {
			console.log($scope.loja);
			for (var i in data) {
				if (data[i].hasOwnProperty('foto')) {
					data[i].foto.img = 'http://localhost:8080/' + data[i].foto.img;
				}
			}
			$scope.loja = data;
		})

		.error(function (statusText) {
			$scope.loja = {};
		});


	$scope.atualizaDados = function () {
		$http.put('http://localhost:8080/lojas/' + userId + '/telefone', $scope.loja.telefone)
			.success(function (data) {
				$state.go('home');
			})

			.error(function (statusText) {
				console.log(statusText);
			});

	}



	$scope.cancelar = function () {
		$state.go('home');
	}



});

 



app.controller('lojasController', function ($scope, $state, $http,loja) {
	$scope.lojas = [];
	$scope.data = {};
	

	$scope.visualizarProdutos = function($index) {
		console.log($index);
		loja.setProperty($scope.lojas[$index]);
		$state.go('visualizarProdutos');	
	}

	$http.get('http://localhost:8080/lojas')
		.success(function (data) {
			
			
			for(var i in data)
			{ 
				if(data[i].hasOwnProperty('foto'))
				{
					data[i].foto.img = 'http://localhost:8080/' + data[i].foto.img;
				}
				console.log(data)

			}
			$scope.lojas = data;
		})
		.error(function (statusText) {
			$scope.lojas = [];
		});
});

app.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});



app.controller('detalhesProdutoController', function ($scope, $http, $state, produto) {
	$scope.produto = {};
	$scope.produto = produto.getProperty();
	var userId = JSON.parse(localStorage.getItem("user")).id;
	//botão: ng-click="cancel()
	$scope.voltar = function () {
		if (userId)
			$state.go('meusProdutos');
		else
			$state.go('visualizarProdutos');
	};
});

app.directive('numbersOnly', function () {
	return {
		require: 'ngModel',
		link: function (scope, element, attrs, modelCtrl) {
			modelCtrl.$parsers.push(function (inputValue) {
				// this next if is necessary for when using ng-required on your input. 
				// In such cases, when a letter is typed first, this parser will be called
				// again, and the 2nd time, the value will be undefined
				if (inputValue == undefined) return ''
				var transformedInput = inputValue.replace(/[^0-9]/g, '');
				if (transformedInput != inputValue) {
					modelCtrl.$setViewValue(transformedInput);
					modelCtrl.$render();
				}

				return transformedInput;
			});
		}
	};
});


app.controller('meusProdutosController', function ($scope, $http, $state, produto,$modal) {

	$scope.produtos = [];
	$scope.minLength = 30;
	

	var userId = JSON.parse(localStorage.getItem("user")).id;
	$http.get('http://localhost:8080/lojas/' + userId + '/produtos') 
		.success(function (data) {
			for(var i in data){
				data[i].data = data[i].data.split('T')[0];
				data[i].foto.img = 'http://localhost:8080/' + data[i].foto.img;
				console.log(data[i].foto.img)
			}
			console.log(data[i].foto.img)
			$scope.produtos = data;
		})
		.error(function (statusText) {
			$scope.produtos = [];
		});
		

	$scope.addProduct = function () {
		$state.go('novoProduto');
	}

	$scope.showEditar = function ($index) {
		produto.setProperty($scope.produtos[$index]);
		$state.go('editar');
	}

	$scope.showVisualizar = function ($index) {
		produto.setProperty($scope.produtos[$index]);
		$state.go('detalhes');
	}

	$scope.eliminar = function($index,size){
		var modalInstance = $modal.open({
			templateUrl: 'partials/modal.html',
			controller: 'modalCtrl',
			size: size,
			resolve: {
    produtoEliminar: function () {
          return $scope.produtos[$index];
        }
      }
		});
		console.log($scope.produtos[$index]._id);
	}
});

app.controller('modalCtrl', function ($scope, $http, $state, $modalInstance, produto,produtoEliminar) {
	var userId = JSON.parse(localStorage.getItem("user")).id;
	$scope.produto = {};
	$scope.produto.nome = produtoEliminar.nome;
	$scope.eliminar = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.ok = function () {
		$http.delete('http://localhost:8080/lojas/' + userId + '/produtos/' + produtoEliminar._id)
		.success(function (data) {
			$modalInstance.dismiss('cancel');
			$state.reload();
		})
		
		.error(function (statusText) {
			console.log(statusText);
		});
	};
});



app.controller('editarProdutoController', function ($scope, $http, $state, produto, categorias) {
	$scope.produtos = {};
	$scope.categorias = categorias.getProperty();
	$scope.produtoEditar = {};

	// visto ser necessario um objeto para tratar as 2 dropdowns pois estao ligadas, e o mongo receber apenas campos separados foi necessario a reconversao em objeto atraves da comparacao com o JSON das categorias
	$scope.produtos = produto.getProperty();
	$scope.categorias.forEach(function (item, key) {

		if (item.nome == $scope.produtos.categoria) {
			$scope.produtos.categoria = item;
			console.log($scope.produtos.categoria);
		}

		$scope.editarProduto = function () {
			$scope.produtoEditar.nome = $scope.produtos.nome;
			$scope.produtoEditar.categoria = $scope.produtos.categoria.nome;
			$scope.produtoEditar.descricao = $scope.produtos.descricao;
			$scope.produtoEditar.preco = $scope.produtos.preco;
			$scope.produtoEditar.stock = $scope.produtos.stock;
			$scope.produtoEditar.tamanho = $scope.tamanho;

			var userId = JSON.parse(localStorage.getItem("user")).id;
			$http.put('http://localhost:8080/lojas/' + userId + '/produtos/' + $scope.produtos._id, $scope.produtoEditar)
				.success(function (data) {
					$state.go('meusProdutos');
				})
				.error(function (statusText) {
					console.log(statusText);
				});

		}

		$scope.cancelar = function () {
			$state.go('meusProdutos');
		}

	})
});


app.directive("fileModel",['$parse',function($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var model = $parse(attrs.fileModel);
			var modelSetter = model.assign;

			element.bind('change',function(){
				scope.$apply(function(){
					modelSetter(scope,element[0].files[0]);
				})
			})
		}
	}
}])

app.directive("ngFileSelect", function () {
	return {
		link: function ($scope, el) {
			el.bind("change", function (e) {
				$scope.file = (e.srcElement || e.target).files[0];
				$scope.getFile();
			});
		}
	}
});



app.service('multipartForm', ['$http', function ($http) {
	this.post = function (uploadUrl, data,callback) {
		var fd = new FormData();
		for (var key in data) {
			fd.append(key, data[key]);
		}
		$http.post(uploadUrl, fd, {
			transformRequest: angular.identity,
			headers: { 'Content-Type': undefined }
		})
		.success(callback)
		.error(callback)

	}
}])





app.controller('registerController', function ($scope, $http, $state, multipartForm) {

	$scope.data = {};
	$scope.message = "";
	$scope.register = function (isValid) {

		console.log($scope.data);
		var uploadUrl = 'http://localhost:8080/registo/';
		multipartForm.post(uploadUrl, $scope.data, function (data, status, headers, config) {
			if (status == 200) {
				var data = {};
				data.password = $scope.data.password;
				data.email = $scope.data.email;
				$http.post('http://localhost:8080/login/', data)
					.success(function (data) {
						var loja = {};
						loja.nome = data.nome;
						loja.id = data._id;
						localStorage.setItem("user", JSON.stringify(loja));
						console.log(data);
						//user.setProperty(data.nome);
						$state.go('home');
					})
					.error(function (statusText) {
						$location.url('/500');
					});
			}
			else {
				$scope.message = "Falhou. Verifique novamente os campos !";
			}

		});
	}
});



app.controller('loginController', function ($scope, $http, $state, user) {
	$scope.message = "";

	$scope.register = function () {
		$state.go('register')
	};

	$scope.login = function () {

		var data = {};
		data.password = $scope.loja.password;
		data.email = $scope.loja.email;
		$http.post('http://localhost:8080/login/', data)
			.success(function (data) {
				var loja = {};
				loja.nome = data.nome;
				loja.id = data._id;
				localStorage.setItem("user", JSON.stringify(loja));
				console.log(data);
				//user.setProperty(data.nome);
				$state.go('home');
			})
			.error(function (statusText) {
				$scope.message = "Falhou. Verifique novamente os campos !";
			});
	}
});