bem-info
========

Сайт документации по bem

## Как поднять копию

### 1. Клонируем репозиторий

```
$ git clone -b v3 git@github.yandex-team.ru:lego/bem-info.git
$ cd bem-info
```

### 2. Собираем проект

```
$ make
```

### 3. Запускаем локально

Если хочется разрабатываться локально, необходимо запускать приложение TCP-порте, вместо сокета. Для этого случая
необходимо использовать набор конфигов `local`, которые обеспечивают старт приложения на порту `process.env.PORT`
(по умолчанию 3014):

```
$ cd configs
$ ln -snf local current
$ cd ..
```

Стартуем приложение:

1. Запускаем сервер для раздачи статических файлов:
```
$ make
```
2. Запускаем сервер приложения (в отдельном процессе):
```
$ npm start
```

Теперь по адресу http://127.0.0.1:3014 вам будет доступна локальная версия bem.info

Для возможности открывать сайт по адресу http://localhost:3014
и русскоязычную версию по http://ru.localhost:3014/ вам необходимо добавить в /etc/hosts записи

```
127.0.0.1       localhost
127.0.0.1       ru.localhost
127.0.0.1       en.localhost
```

### Контакты

@lego-team:

* [@bemer](http://staff/bemer)
* [@blond](http://staff/blond)
* [@lesanra](http://staff/lesanra)
