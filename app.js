var createError = require('http-errors'); //zaimportowana biblioteka błedów http, które w dalszej części skryptu będziemy przechwytywali
var express = require('express'); //import expresu
var path = require('path'); //import path do pobierania ścieżek, w tym przypadku będzie nam to słuzyło do pobierania ścieżki public, w której mamy nasze asety strony
var cookieParser = require('cookie-parser'); //biblioteka która będzie nas wspierała w parsowaniu cookisów które będzie generował serwer. Cookisy będą  w naszym projekcie nie używane, ale zostawimy sobie tę bibliotekę, bo w większości naszych projektów na pewno bęziemy wykorzystywali cookisy
var logger = require('morgan'); //loger z biblioteki morgan, słuzy nam on do zrzucania logów w trybie deweloperskim

//przechodzimy do kodu który będziemy sobie  odyfikowali i rozwijali. Mamy tutaj dwa importy naszego routingu z katalogu routes. Jest to import strony startowej i import przykładowej strony użytkownika
var indexRouter = require('./routes/index');
//tu imporujemy utworzone w routes zakłądki
var newsRouter = require('./routes/news');
var quizRouter = require('./routes/quiz');
var adminRouter = require('./routes/admin');

var app = express(); //uruchamiamy nasz server, czyli wywołujemy funkcję express

// view engine setup
app.set('views', path.join(__dirname, 'views')); //konfigurujemy nasz katalog z widokami, czyli katalog w którym będziemy tworzyli nasze szablony, nasze szablony templaty w pugu
app.set('view engine', 'pug'); //ustawiamy silnik do naszego systemu szablonów pug

app.use(logger('dev')); //uruchamiamy i przekazujemy za pomoca app.use(jest to wywołąnie expressu i używamy tyutaj metody use) dalsze middlewarsy, czyli rozszerzenia które będziemy dalej wykorzystywali w naszym expressie za pomocą use. Będziemy tez dodatkowo doinstalowywali bibliotekę do sesji. więc tez będziemy używali use. Będziemy tez doinstalowywali biblioteke do obsługi mongodb, które będzie wykorzystane w projekcie
app.use(express.json()); //przechwytywanie naszego body. W tym przypadku nie będziemy wykorzystywali, ale gdybyśmy pisali np za pomoca expressu api, to byśmy w body wysyłali jsona i ta metoda uprości nam korzystanie z expressu, poniewaz json który będzie w body będzie automatycznie parsowany na obiekt. Będziemy już mogli odwoływac się bezpośrednio, a nie za każdym razem go parsować
app.use(express.urlencoded({ extended: false })); //parsowanie formularzy. W tym przypadku będziemy wysyłali dane w formularzu postem na nasze requesty i ten zapis spowoduje nam automatyczne też tego sparsowanie i będziemy to wykorzystywali za pomocą obiektu w naszym requeście
app.use(cookieParser()); //używanie biblioteki do cookieparsera, który mówiłem że nie bedizemy wykorzystywali w tym projekcie, ale zostawmy to na przyszłosć
app.use(express.static(path.join(__dirname, 'public'))); //deklarujemy nasz katalog statyczny, katalog z naszymi asetami. Asety to są np pliki javascriptowe, które są ładowane po stronie klienta, nie nodowe. Mmay tu w katalogu public  np pliki styli. Są tez obrazki. Ale w katalogu aset będziemy deklarowali wszystko to co bedzie publicznie dostępne po stronie przeglądarki dla naszego użytkownika

//Teraz przechodzimy do app.js i dodamy sobie taką nowość która oferuje nam express. Utworzymy sobie funkcję, która będzie routem, takim trochę uproszczonym routem, a mianowicie będzie pobierała z parametru request, czyli z tego co serwer dostaje na wejście aktualny adres strony i ten adres strony będziemy przekazywali do każdego naszego widoku, czyli pobieramy, pzrypisujemy zmienną, która będzie przekazywana do wszystkich widoków i puszcamy scypt dalej. Zeby puścić scrypt dalej, wykorzystamy sobie wspomniana wcześniej metodę next. Metoda next pozwoli nam na to że scrypt nie zatrzyma nam się na tym routingu, bo ten routing będzie wywoływany zawsze, ale puści nas do pozostałych routigów. Czyli jeżeli będziemy na adresie news, najpierw nam się wywołą nasz routing, który teraz będziemy pisali, a następnie dzięki temu że wywołą next on przejdzie do naszego już zadeklarowanego routingu. Więc uzywamy app.use i w app.use będziemy przekazywali callback i tak jak w pozostałych routingach pierwszy parametr request, drugi parametr response, następnie jest next, czyli 3 parametry. Następnie wyprintujemy sobie to co znajduje się w req.path, poniewaz pod request.path, czyli pod pierwszym parametrem callbacku znajduje się aktualny adres strony i powinniśmy go zobaczyc na konsoli. Ale tak to nam się zawiesi serwer. Aby przeszedł dalej musimy dopisać next(). I weryfikujemy i jest ok.
app.use(function(req, res, next) {
  // console.log(req.path);
  res.locals.path = req.path; //Teraz wystarczy przenieść ten req.path do naszych szablonów. A jak widzimy w app.js nie renderujemy tu żadnego szablonu. Tak więc musimy sie posłużyć gloablnymi zmiennymi. aby to zrobić to musimy ten req.path przypisac do response z lokalnymi zmiennymi. Jest to parametr locals i wpisujemy sobie swoją nazwę pod którą będzie dodtępny ten path. My tę nazwę zachowamy czyli będzie to locals.path. dzięki takiemu zapisowi, czyli dzięki przekazaniu tego patha do localsów, będziemy mieli go globalnie dostępnego w naszych szablonach
  next();
});

//deklaracja routingów, to co zaiportowaliśmy wyżej mamy teraz tu wywołane za pomoca use i pierwssy parametr jest to deklaracja adresu pod którym będzie dodstępny dany router. To będziemy sobie modyfikowali i dodawali następne routingi
app.use('/', indexRouter); //deklaracja za pomocą samego slasha że będzie on dodtepny ze sttony startowej
//tu wywołujemy te zakłądki pod różnymi adresami
app.use('/news', newsRouter);
app.use('/quiz', quizRouter);
app.use('/admin', adminRouter);

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
