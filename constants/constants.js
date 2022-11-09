JWT_SECRET="db31c6916c507c3d607d59ba4c242c7f7b66114a1206279766cb82b4395336c0"

const STATUS = {
  DEFAULT_ERROR: 500,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};

const ERROR_NAME = {
  CAST: 'CastError',
  VALIDATION: 'ValidationError',
};

const MESSAGE = {
  AUTH_SUCCESS: 'Авторизация прошла успешно',
};

const ERROR_MESSAGE = {
  NOT_FOUND: {
    PAGE: 'Страница не найдена.',
    USER: 'Пользователь с указанным _id не найден.',
    CARD: 'Карточка с указанным _id не найдена.',
    CARD_LIKES: 'Передан несуществующий _id карточки.',
  },
  BAD_REQUEST: {
    CARD: 'Переданы некорректные данные при создании карточки.',
    CARD_LIKES: 'Переданы некорректные данные для постановки/снятии лайка.',
    USER_GET: 'Некорректный _id при поиске пользователя.',
    USER_CREATE: 'Переданы некорректные данные при создании пользователя.',
    USER_UPDATE: 'Переданы некорректные данные при обновлении профиля.',
    AVATAR: 'Переданы некорректные данные при обновлении аватара.',
  },
  AUTH_ERROR: 'Необходима авторизация',
  DEFAULT_ERROR: 'На сервере произошла ошибка.',
};

module.exports = {
  STATUS, ERROR_MESSAGE, ERROR_NAME, MESSAGE, JWT_SECRET
};
