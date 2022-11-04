const STATUS = {
  OK : 200,
  DEFAULT_ERROR : 500,
  BAD_REQUEST : 400,
  NOT_FOUND : 404
}

const ERROR_MESSAGE = {
  NOT_FOUND: {
    PAGE: "Страница не найдена.",
    USER: "Пользователь с указанным _id не найден.",
    CARD: "Карточка с указанным _id не найдена.",
    CARD_LIKES: "Передан несуществующий _id карточки.",
    AVATAR: "Пользователь с указанным _id не найден."
  },
  BAD_REQUEST: {
    CARD: "Переданы некорректные данные при создании карточки.",
    CARD_LIKES: "Переданы некорректные данные для постановки/снятии лайка.",
    USER_CREATE: "Переданы некорректные данные при создании пользователя.",
    USER_UPDATE: "Переданы некорректные данные при обновлении профиля.",
    AVATAR: "Переданы некорректные данные при обновлении аватара."
  },
  DEFAULT_ERROR: "Ошибка по умолчанию.",
}

module.exports = { STATUS, ERROR_MESSAGE }
