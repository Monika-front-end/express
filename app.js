var createError = require('http-errors'); //zaimportowana biblioteka błedów http, które w dalszej części skryptu będziemy przechwytywali
var express = require('express'); //import expresu
var path = require('path'); //import path do pobierania ścieżek, w tym przypadku będzie nam to słuzyło do pobierania ścieżki public, w której mamy nasze asety strony
var cookieParser = require('cookie-parser'); //biblioteka która będzie nas wspierała w parsowaniu cookisów które będzie generował serwer. Cookisy będą  w naszym projekcie nie używane, ale zostawimy sobie tę bibliotekę, bo w większości naszych projektów na pewno bęziemy wykorzystywali cookisy
var logger = require('morgan'); //loger z biblioteki morgan, słuzy nam on do zrzucania logów w trybie deweloperskim

//przechodzimy do kodu który będziemy sobie  odyfikowali i rozwijali. Mamy tutaj dwa importy naszego routingu z katalogu routes. Jest to import strony startowej i import przykładowej strony użytkownika
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express(); //uruchamiamy nasz server, czyli wywołujemy funkcję express

// view engine setup
app.set('views', path.join(__dirname, 'views')); //konfigurujemy nasz katalog z widokami, czyli katalog w którym będziemy tworzyli nasze szablony, nasze szablony templaty w pugu
app.set('view engine', 'pug'); //ustawiamy silnik do naszego systemu szablonów pug

app.use(logger('dev')); //uruchamiamy i przekazujemy za pomoca app.use(jest to wywołąnie expressu i używamy tyutaj metody use) dalsze middlewarsy, czyli rozszerzenia które będziemy dalej wykorzystywali w naszym expressie za pomocą use. Będziemy tez dodatkowo doinstalowywali bibliotekę do sesji. więc tez będziemy używali use. Będziemy tez doinstalowywali biblioteke do obsługi mongodb, które będzie wykorzystane w projekcie
app.use(express.json()); //przechwytywanie naszego body. W tym przypadku nie będziemy wykorzystywali, ale gdybyśmy pisali np za pomoca expressu api, to byśmy w body wysyłali jsona i ta metoda uprości nam korzystanie z expressu, poniewaz json który będzie w body będzie automatycznie parsowany na obiekt. Będziemy już mogli odwoływac się bezpośrednio, a nie za każdym razem go parsować
app.use(express.urlencoded({ extended: false })); //parsowanie formularzy. W tym przypadku będziemy wysyłali dane w formularzu postem na nasze requesty i ten zapis spowoduje nam automatyczne też tego sparsowanie i będziemy to wykorzystywali za pomocą obiektu w naszym requeście
app.use(cookieParser()); //używanie biblioteki do cookieparsera, który mówiłem że nie bedizemy wykorzystywali w tym projekcie, ale zostawmy to na przyszłosć
app.use(express.static(path.join(__dirname, 'public'))); //deklarujemy nasz katalog statyczny, katalog z naszymi asetami. Asety to są np pliki javascriptowe, które są ładowane po stronie klienta, nie nodowe. Mmay tu w katalogu public  np pliki styli. Są tez obrazki. Ale w katalogu aset będziemy deklarowali wszystko to co bedzie publicznie dostępne po stronie przeglądarki dla naszego użytkownika

//deklaracja routingów, to co zaiportowaliśmy wyżej mamy teraz tu wywołane za pomoca use i pierwssy parametr jest to deklaracja adresu pod którym będzie dodstępny dany router. To będziemy sobie modyfikowali i dodawali następne routingi
app.use('/', indexRouter); //deklaracja za pomocą samego slasha że będzie on dodtepny ze sttony startowej
app.use('/users', usersRouter);

// catch 404 and forward to error handler. Przechwytywanie błędów. Jest to catcher który będzie nam wyłapywał adresy które nie istnieją za pomoca createError z biblioteki http errors
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler.Przechwytywanie pozostałych błędów. Możemy mieć różne błędy. Prawdopodobnie będą to błędy 500. Błąd 500 to będzie błąd naszego serwera jakiś błąd w logice  w kodzie
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {}; //sprawdzamy czy działąmy jescze w trybie developement. Część błędów pokazujemy na stronie internetowej

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
