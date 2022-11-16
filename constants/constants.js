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

const urlValidatorPattern = /^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-/])*)?/;

module.exports = {
  ERROR_MESSAGE, ERROR_NAME, MESSAGE, urlValidatorPattern,
};
