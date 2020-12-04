import React from "react";

export interface IHomeProps {}

const Home: React.FC<IHomeProps> = ({}) => (
  <div className="home container">
    <h1 id="openedu-functions">Openedu functions</h1>
    <p>
      На данный момент в клиенте реализована одна функция - приглашение
      студентов и запись их на курсы.
    </p>
    <h2 id="-">Авторизация</h2>
    <p>
      Перед тем как начать работу с данным приложением, требуется
      авторизоваться. Для этого необходимо:
    </p>
    <ul>
      <li>
        перейти во вкладку <strong>Authenticate</strong>
      </li>
      <li>
        ввести свой логин и пароль, нажать <strong>Sign in</strong>
      </li>
      <li>
        подождать и получить уведомление с сообщением &quot;Authenticated&quot;
      </li>
    </ul>
    <p>
      В правом верхнем углу должна появиться зелёная надпись &quot;Authenticated
      to Openedu&quot;
    </p>
    <p>После этого можно использовать приложение.</p>
    <h2 id="-">Приглашение студентов и их запись на курсы</h2>
    <p>Для этого необходимо:</p>
    <ul>
      <li>
        перейти во вкладку <strong>Invite and enroll students</strong>
      </li>
      <li>
        выбрать файл, содержащий таблицу со списком студентов и их курсами,
        нажать <strong>Send</strong>
      </li>
    </ul>
    <p>Файл должен содержать следующие поля:</p>
    <ul>
      <li>Email</li>
      <li>Name</li>
      <li>Surname</li>
      <li>SecondName(необязательно, но столбец должен присутствовать)</li>
      <li>CourseName</li>
      <li>Session</li>
    </ul>
    <p>
      На данный момент принимаются только файлы в формате CSV с двоеточием в
      качестве разделителя.
    </p>
  </div>
);

export { Home };
