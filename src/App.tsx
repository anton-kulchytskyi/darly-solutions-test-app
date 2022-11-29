import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import 'bulma/css/bulma.min.css';
import { Form } from './components/Form';
import { UsersList } from './components/UsersList';
import { Loader } from './components/Loader';

export const App: React.FC = () => {
  const [loadPage, setLoadPage] = useState(false);
  const [users, setUsers] = useState<User[] | []>([]);
  const [userById, setUserById] = useState<User | null>(null)
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState(false);
  const [limit, setLimit] = useState<number>(10);

  const getUsers = () => {
    axios
      .get(`http://localhost:5000/users?_start=${limit-10}&_end=${limit}`)
      .then(({ data }) => setUsers((users) => [...users, ...data]))
      .catch(err => console.log(err));
  }

  function getMoreUsers() {
    setTimeout(() => {
      axios
        .get(`http://localhost:5000/users?_start=${limit-10}&_end=${limit}`)
        .then(({ data }) => setUsers((users) => [...users, ...data]))
        .catch(err => console.log(err));
      setIsFetching(false);
    }, 500);
  }

  const updateUser = async (id: number) => {
    const user = await axios.get(`http://localhost:5000/users/${id}`);
    setUserById(user.data)
    openModal();
  }

  const openModal = () => {
    setLoadPage(loadPage => !loadPage);
    setShowModal(showModal => !showModal);
  }

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    setLimit(limit => limit += 10)
    setIsFetching(true);
  }

  useEffect(() => {
    getUsers();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    getMoreUsers();
  }, [isFetching]);

  // window.addEventListener("scroll", scrollHandler)



  return (
    <div className="App container has-text-centered">
      <h1 className="title is-1">Users list</h1>
      <button
        className="button"
        onClick={openModal}
      >
        Add / update user
      </button>
      {loadPage ? (
        <Loader />
      ) : (
        <UsersList
          users={users}
          setUsers={setUsers}
          updateUser={updateUser}
        />
      )}
      {showModal
        &&
        <Form
          openModal={openModal}
          showModal={showModal}
          users={users}
          setUserById={setUserById}
          userById={userById}
        />
      }
    </div>
  );
}
