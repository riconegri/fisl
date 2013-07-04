angular.module('fisl', ['ui.bootstrap' ]);
function FislCtrl($scope, $http) {
    $scope.changesToSave = 1;
    $scope.block_module = "/partials/blocks.html";
    $scope.blocks = [
        {"nome" : "Meus dados", "file" : "/partials/meus-dados.html", "class": "meus-dados", "order" : 1},
        {"nome" : "Esportes", "file" : "/partials/esportes.html", "class": "esportes", "order" : 2},
        {"nome" : "Cidades e datas", "class": "cidades", "file" : "/partials/onde-morei.html", "order" : 3},
        {"nome" : "Galeria", "class": "galeria", "file" : "/partials/galeria.html", "order" : 3},
        {"nome" : "Minhas Compras", "class": "minhas-compras", "file" : "/partials/minhas-compras.html", "order" : 3},
        {"nome" : "Meus Vídeos", "class": "meus-videos", "file" : "/partials/meus-videos.html", "order" : 3}

    ];
    $scope.saveNumber = 0;
    $scope.oneAtATime = true;
    $scope.esportes = [];
    $scope.videos = [];
    $scope.player = false;
    //$http.get('./js/user.json').then(function ( res ) {
    $http.get('/update').then(function ( res ) {
        res.data._id = undefined;
        $scope.obj = res.data;
        console.log( $scope.obj );
    }).then( function () {
        for ( var i in $scope.obj.esportes ){
            var esporte =  $scope.obj.esportes[i];
            for ( var ii in esporte.equipe_preferidas ) {
                var equipe = esporte.equipe_preferidas[ii];
                $http.get('./js/' + equipe.noticias).then(function ( res ){
                    $scope.esportes.push( res.data.channel );
                });
            }
        }
        $http.get("http://gdata.youtube.com/feeds/api/standardfeeds/most_popular?v=2&alt=json").then( function( res ) {
            var vds = res.data.feed.entry;
            for ( var i in vds ) {
                console.log();
                $scope.videos.push(vds[i].media$group.yt$videoid.$t );
            }
        });
    });
    $scope.open = function ( id ) {
        $scope.player = id;
        $scope.shouldBeOpen = true;
    };

    $scope.close = function () {
        $scope.closeMsg = 'I was closed at: ' + new Date();
        $scope.shouldBeOpen = false;
    };


    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.addEmail = function ( i ) {
        $scope.obj.email.push( "novo@email.com" );
    };

    $scope.bigNoOfPages = 18;
    $scope.bigCurrentPage = 1;

    $scope.log = function () {
        console.log( $scope );
    }
    $scope.myInterval = 3000;
    var slides = $scope.slides = [];
    $scope.addSlide = function() {
        var newWidth = 360 + ((slides.length + (25 * slides.length)) % 200);
        slides.push({
            image: 'http://placekitten.com/' + newWidth + '/280',
            text: ['Mais','Extra','Um monte','Vários'][slides.length % 4] + ' ' +
                ['Gatos', 'Miau', 'Mintsi', 'Bichanos'][slides.length % 4]
        });
    };
    for (var i=0; i<4; i++) {
        $scope.addSlide();
    }
    $scope.$watch('obj', function(newValue, oldValue) {
        if (newValue){
            if( $scope.saveNumber === $scope.changesToSave){
                $http.post( '/update', $scope.obj).then( function ( res ) {
                    console.log( res );
                    //$scope.obj._id = res.data._id;
                } );
                $scope.saveNumber = 0
            } else {
                $scope.saveNumber += 1;
            }
        }
    },true);
}