import { SwaggerTag } from './swagger-tags.interface';

export const _SWAGGER_TAGS: SwaggerTag[] = [
  {
    name: 'auth',
    description: 'Эндпоинты для авторизации',
  },
  {
    name: 'user',
    description: 'Эндпоинты для работы с данными пользователя',
  },
  {
    name: 'tag',
    description: 'Эндпоинты для работы с тегами/треками проектов',
  },
  {
    name: 'period',
    description: 'Эндпоинты для работы с семестрами',
  },
  {
    name: 'course',
    description: 'Эндпоинты для работы с курсами студентов',
  },
  {
    name: 'teamproject',
    description: 'Эндпоинты для взаимодействия с сервисом Teamproject',
  },
];
