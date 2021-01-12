import {Category, Priority, Task} from '../model/interfaces';

export class TestData {

  static categories: Category[] = [
    {id: 1, title: 'Работа'},
    {id: 2, title: 'Семья'},
    {id: 3, title: 'Учеба'},
    {id: 4, title: 'Отдых'},
    {id: 5, title: 'Спорт'},
    {id: 6, title: 'Еда'},
    {id: 7, title: 'Финансы'},
    {id: 8, title: 'Гаджеты'},
    {id: 9, title: 'Здоровье'},
    {id: 10, title: 'Автомобиль'},
    {id: 11, title: 'Ремонт'},
  ];

  static priorities: Priority[] = [
    {id: 1, title: 'Низкий', color: '#e5e5e5'},
    {id: 2, title: 'Средний', color: '#85D1B2'},
    {id: 3, title: 'Высокий', color: '#F1828D'},
    {id: 4, title: 'Очень срочно!', color: '#ff2121'}
  ];

  static tasks: Task[] = [
    {
      id: 1,
      title: 'Залить бензин полный бак',
      priority: TestData.priorities[2],
      completed: false,
      category: TestData.categories[9],
      date: new Date('2021-04-10')
    },

    {
      id: 2,
      title: 'Передать отчеты начальнику управления',
      priority: TestData.priorities[0],
      completed: false,
      category: TestData.categories[0],
      date: new Date('2021-04-15')
    },

    {
      id: 3,
      title: 'Убрать в доме, полить растения',
      priority: TestData.priorities[2],
      completed: true,
      category: TestData.categories[1]
    },

    {
      id: 4,
      title: 'Сходить в парк с семьей, пригласить друзей',
      priority: TestData.priorities[1],
      completed: false,
      category: TestData.categories[1],
      date: new Date('2021-08-17')
    },
    {
      id: 5,
      title: 'Выучить учебники по Angular and Spring',
      completed: false,
      category: TestData.categories[2]
    },
    {
      id: 6,
      title: 'Сходить на семинар по программированию',
      priority: TestData.priorities[1],
      completed: true,
      category: TestData.categories[2],
      date: new Date('2021-06-11')
    },

    {
      id: 7,
      title: 'Купить билеты в Турцию, выбрать отель',
      priority: TestData.priorities[2],
      completed: false,
      category: TestData.categories[3]
    },
    {
      id: 8,
      title: 'Приготовить ужин для всей семьи',
      completed: false,
      category: TestData.categories[5]
    },
    {
      id: 9,
      title: 'Подтянуться 1000 раз',
      priority: TestData.priorities[2],
      completed: false,
      category: TestData.categories[4],
      date: new Date('2021-01-05')
    },
    {
      id: 10,
      title: 'Пробежать 100000 м',
      priority: TestData.priorities[0],
      completed: true,
      category: TestData.categories[4]
    },

    {
      id: 11,
      title: 'Организовать детский праздник',
      completed: false
    },

    {
      id: 12,
      title: 'Сходить на лекцию "Микросервисы"',
      priority: TestData.priorities[1],
      completed: false,
      category: TestData.categories[2]
    },
    {
      id: 13,
      title: 'Купить продукты на неделю',
      priority: TestData.priorities[2],
      completed: false,
      category: TestData.categories[5],
      date: new Date('2021-05-11')
    },

    {
      id: 14,
      title: 'Провести собрание по поводу всех проектов',
      completed: true,
      category: TestData.categories[0]
    },

    {
      id: 15,
      title: 'Принять экзамен по Java',
      priority: TestData.priorities[2],
      completed: true
    },


    {
      id: 16,
      title: 'Положить 100 000 000 $ в банк на депозит',
      priority: TestData.priorities[3],
      completed: false,
      category: TestData.categories[6]
    },

    {
      id: 17,
      title: 'Открыть фирму',
      priority: TestData.priorities[2],
      completed: false,
      category: TestData.categories[6]
    },

    {
      id: 18,
      title: 'Купить четвёртый монитор',
      priority: TestData.priorities[0],
      completed: false,
      category: TestData.categories[7],
      date: new Date('2021-01-11')

    },

    {
      id: 19,
      title: 'Футбол с сотрудниками',
      priority: TestData.priorities[0],
      completed: false,
      category: TestData.categories[4],
      date: new Date('2021-01-06')

    }
  ];
}
