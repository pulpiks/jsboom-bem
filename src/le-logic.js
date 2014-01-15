var leJspath = require('./le-jspath'),
    HttpError = require('./errors').HttpError;

module.exports = {

    _logicCache: {},

    /**
     * Genenrates cache key for logic cache
     * @param  {Object} data - object with request and response params
     * @return {String} key which build from current locale and request path
     */
    generateKey: function(data) {
        return data.req.prefLocale + ':' + data.req._parsedUrl.pathname;
    },

    /**
     * Returns logic cache by data request path
     * @param  {Object} data - object with request and response params
     * @return {Object} - object with params of data
     */
    getLogicCache: function(data) {
        return this._logicCache[this.generateKey(data)];
    },

    /**
     * Sets logic cache
     * @param  {Object} data - object with request and response params
     * @param  {Object} value - object with params of data
     */
    setLogicCache: function(data, value) {
        this._logicCache[this.generateKey(data)] = value;
    },

    /**
     * Implements logic for resolving methodology urls
     * @param  {Object} data - object with request and response params
     * @return {Object} result - object with params of data
     *  - error {Object} error with  status and error code or false
     *  - type - {String} type of resource
     *  - category - {String} category of resource
     *  - id - {String} unique id if resource
     *  - query - {Object} query object for menu block
     */
    resolveMethodology: function(data) {
        //достаем закешированный результат
        var result = this.getLogicCache(data);

        //если он есть то возвращаем его
        if (result) {
            return result;
        }

        //type устанавливаем по data.page
        //достаем корневой пост по значению type и текущей локали
        //берем slug для поста из параметров запроса
        var type = data.req.route,
            rootId = leJspath.findRootPostId(type, data.req.prefLocale),
            id = data.req.params.id;

        result = {
            error: false,
            type: type,
            category: null,
            query: {
                predicate: '.' + data.req.prefLocale + '{.type === $type}{.id !== $rootId}',
                substitution: { type: type, rootId: rootId }
            }
        };

        //если в запросе был передан slug поста, то пробуем найти пост по чатичному совпадению
        //его полного url-а c адрестной строкой в браузере
        //если пост не был найден то показываем 404 ошибку
        //если в запросе не был передан slug поста то показываем корневой пост
        if (id) {
            var res = leJspath.findByUrl(data.req._parsedUrl.pathname, data.req.prefLocale);

            if (!res) {
                throw new HttpError(HttpError.CODES.NOT_FOUND);
            } else {
                res = leJspath.findCategoryAndIdByUrl(data.req._parsedUrl.pathname, type, data.req.prefLocale);
                result.id = res.id;
                result.category = res.category;
            }
        } else {
            result.id = rootId;
        }

        //кешируем построенный результат и возвращаем его
        this.setLogicCache(data, result);
        return result;
    },

    /**
     * Implements logic for resolving articles urls
     * @param  {Object} data - object with request and response params
     * @return {type} result - object with params of data
     *  - error {Object} error with  status and error code or false
     *  - type - {String} type of resource
     *  - category - {String} category of resource
     *  - id - {String} unique id if resource
     *  - query - {Object} query object for menu block
     */
    resolveArticles: function(data) {
        //достаем закешированный результат
        var result = this.getLogicCache(data);

        //если он есть то возвращаем его
        if (result) {
            return result;
        }

        //Делаем проверку на то, что мы находимся в корне раздела articles
        //составляем первичный объект с результатами обработки логики
        var type = data.req.route,
            isRoot = Object.getOwnPropertyNames(data.req.params).length === 0,
            result = {
                error: false,
                type: type,
                id: null,
                category: null,
                query: {
                    predicate: '.' + data.req.prefLocale + '{.type === $type}',
                    substitution: { type: type }
                }
            };

        //Если мы не находимся в корне раздела статей, то пытаемся найти  пост по полному совпадению
        //его полного url с data.req._parsedUrl.pathname. Если пост не находится то показываем 404 ошибку
        //если находится то дополнительно прогоняем через поиск для определения категории
        if (!isRoot) {
            var res = leJspath.findByUrl(data.req._parsedUrl.pathname, data.req.prefLocale);
            if (!res) {
                throw new HttpError(HttpError.CODES.NOT_FOUND);
            } else {
                res = leJspath.findCategoryAndIdByUrl(data.req._parsedUrl.pathname, type, data.req.prefLocale);
                result.id = res.id;
                result.category = res.category;
            }
        }

        //кешируем построенный результат и возвращаем его
        this.setLogicCache(data, result);
        return result;
    },

    /**
     * Implements logic for resolving news urls
     * @param  {Object} data - object with request and response params
     * @return {type} result - object with params of data
     *  - error {Object} error with  status and error code or false
     *  - type - {String} type of resource
     *  - category - {String} category of resource
     *  - id - {String} unique id if resource
     *  - query - {Object} query object for menu block
     */
    resolveNews: function(data) {
        //достаем закешированный результат
        var result = this.getLogicCache(data);

        //если он есть то возвращаем его
        if (result) {
            return result;
        }

        var type = data.req.route,
            isRoot = Object.getOwnPropertyNames(data.req.params).length === 0,
            result = {
                error: false,
                type: type,
                id: null,
                category: null,
                query: {
                    predicate: '.' + data.req.prefLocale + '{.type === $type}',
                    substitution: { type: type }
                }
            };

        //Если мы не находимся в корне раздела новостей, то пытаемся найти  пост по полному совпадению
        //его полного url с data.req._parsedUrl.pathname. Если пост не находится то показываем 404 ошибку
        //если находится то дополнительно прогоняем через поиск для определения категории
        if (!isRoot) {
            if (data.req.params.id) {
                var res = leJspath.findByUrl(data.req._parsedUrl.pathname, data.req.prefLocale);
                if (!res) {
                    throw new HttpError(HttpError.CODES.NOT_FOUND);
                } else {
                    res = leJspath.findCategoryAndIdByUrl(data.req._parsedUrl.pathname, type, data.req.prefLocale);
                    result.id = res.id;
                    result.category = res.category;
                }
            } else {
                var year = parseInt(data.req.params.year),
                    month = parseInt(data.req.params.month),
                    dateFrom = new Date(year, month ? month - 1 : 0).valueOf(),
                    dateTo = new Date(month ? year : year + 1, month || 0).valueOf();

                result.query.predicate = '.' +
                    data.req.prefLocale + '{.type === $type && .createDate > ' +
                    dateFrom + ' && .createDate < ' + dateTo + '}';
            }
        }

        //кешируем построенный результат и возвращаем его
        this.setLogicCache(data, result);
        return result;
    },

    /**
     * Implements logic for resolving tools urls
     * @param  {Object} data - object with request and response params
     * @return {type} result - object with params of data
     *  - error {Object} error with  status and error code or false
     *  - type - {String} type of resource
     *  - category - {String} category of resource
     *  - id - {String} unique id if resource
     *  - query - {Object} query object for menu block
     *  - isOnlyOnePost - {Boolean} indicates that is only one post exist for current selected category
     */
    resolveTools: function(data) {
        //достаем закешированный результат
        var result = this.getLogicCache(data);

        //если он есть то возвращаем его
        if (result) {
            return result;
        }

        var type = data.req.route,
            isRoot = Object.getOwnPropertyNames(data.req.params).length === 0,
            rootId = leJspath.findRootPostId(type, data.req.prefLocale),
            result = {
                error: false,
                type: type,
                id: rootId,
                category: null,
                query: {
                    predicate: '.' + data.req.prefLocale + '{.type === $type}',
                    substitution: { type: type }
                },
                isOnlyOnePost: false
            };

        //Если у нас корневой пост, то дальне ничего не нужно делать
        //возвращаем результат
        if (isRoot) {
            return result;
        }

        //запускаем мега-метод по поиску id и категории по url
        var res = leJspath.findCategoryAndIdByUrl(data.req._parsedUrl.pathname, type, data.req.prefLocale);

        //если ничего не найдено, то возвращаем 404 ошибку
        //тут есть упячка про то что этот метод срабатывает на частичное совпадение
        //т.е. если дописать к урлу разное то статья тоже найдется
        //но с другой стороны если что-то в середине будет неправильно то 404 выдастся
        if (!res) {
            throw new HttpError(HttpError.CODES.NOT_FOUND);
        }

        result.category = res && res.category;
        result.id = res && res.id;

        //если была найдена категория, то нужно дополнительное исследование
        //составляем query постов для выбранной категории
        if (result.category) {
            var predicate = '.' + data.req.prefLocale + '{.type === $type}' +
                '{.categories === $category || .categories.url === $category}';

            //находим корневой пост для выбранной категории
            //если id еще не был установлен и есть корневой пост то показываем его
            rootId = leJspath.findRootPostIdByCategory(type, result.category, data.req.prefLocale);
            if (rootId) {
                predicate +=  '{.id !== "' + rootId + '"}';
            }

            if (!result.id && rootId) {
                result.id = rootId;
            }

            result.query = {
                predicate: predicate,
                substitution: { type: type, category: result.category }
            };

            //проверка на то, что для данного инструмента есть только один пост
            //если это так, то показываем его в развернутом виде а меню постов прячем
            var source = leJspath.find(result.query.predicate, result.query.substitution);
            if (source.length === 1) {
                result.isOnlyOnePost = true;
                result.id = source.shift().id;
            }
        }

        //кешируем построенный результат и возвращаем его
        this.setLogicCache(data, result);
        return result;
    },

    resolveLibraries: function(data) {
        var result = this.getLogicCache(data);

        if (result) {
            return result;
        }


        var type = data.req.route,
            lib = data.req.params.lib || null,
            version = data.req.params.version || null,
            category = data.req.params.category || null,
            id = data.req.params.id,

            predicate = '.' + data.req.prefLocale + '{ .type == $type }',
            substitution = { type: type },
            query = null,

            path = data.req._parsedUrl.pathname.split('/').reduce(function(prev, item) {
                return item.length > 0 ? (prev + '/' + item) : (prev.toString());
            }, '');

        id = leJspath.findByUrl(path, data.req.prefLocale);

        id = id && id.id;

        if (lib) {
            predicate += '{.categories ^== $category || .categories.url ^== $category }';
            substitution.category = lib;

            if (version){
                substitution.category = lib + '/' + version ;
            }

            //поиск корневой статьи для библиотеки и показ ее если не указан id другого поста для библиотеки явно
            var rootId = leJspath.find(predicate + '{.root == "true"}.id', substitution);
            rootId = rootId.length > 0 ? rootId[0] : null;

            if (rootId) {
                predicate += '{.id !== $rootId}';
                substitution.rootId = rootId;
                id = id || rootId;
            }
        }

        query = { predicate: predicate, substitution: substitution };

        result = {
            type: type,
            id: id,
            category: category,
            query: query,

            lib: lib,
            version: version
        };

        //кешируем построенный результат и возвращаем его
        this.setLogicCache(data, result);
        return result;
    },

    /**
     * Implements logic for resolving urls for general pages such as jobs or acknowledgements
     * @param  {Object} data - object with request and response params
     * @return {type} result - object with params of data
     *  - error {Object} error with  status and error code or false
     *  - type - {String} type of resource
     *  - category - {String} category of resource
     *  - id - {String} unique id if resource
     *  - query - {Object} query object for menu block
     */
    resolveCustomPage: function(data) {
        //достаем закешированный результат
        var result = this.getLogicCache(data);

        //если он есть то возвращаем его
        if (result) {
            return result;
        }


        var type = 'page',
            path = '/' + type + data.req._parsedUrl.pathname;

        result = {
            error: false,
            type: type,
            id: null,
            category: null,
            query: {
                predicate: '.' + data.req.prefLocale + '{.type === $type}',
                substitution: { type: type }
            }
        };

        //Пытаемся найти  пост по полному совпадению
        //его полного url с data.req._parsedUrl.pathname. Если пост не находится то показываем 404 ошибку
        //если находится то дополнительно прогоняем через поиск для определения категории
        var res = leJspath.findByUrl(path, data.req.prefLocale);
        if (!res) {
            throw new HttpError(HttpError.CODES.NOT_FOUND);
        } else {
            res = leJspath.findCategoryAndIdByUrl(path, type, data.req.prefLocale);
            result.id = res.id;
            result.category = res.category;
        }

        //кешируем построенный результат и возвращаем его
        this.setLogicCache(data, result);
        return result;
    }

};
