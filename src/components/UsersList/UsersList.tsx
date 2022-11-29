import React, { Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import { mdiTrashCanOutline } from '@mdi/js';
import { mdiTextBoxEditOutline } from '@mdi/js';

type Props = {
  users: User[],
  updateUser: (id: number) => void,
  setUsers: Dispatch<SetStateAction<User[] | []>>;
};

export const UsersList: React.FC<Props> = ({ users, setUsers, updateUser}) => {
  const deleteUser = (id: number) => {
    axios.delete(`http://localhost:5000/users/${id}`);
    setUsers(users.filter(user => user.id !== id))
  }

  return (
    <div className="card">
      <div className="card-content is-max-desktop">
        <div className="content is-centered">
          <table className="table">
            <thead className="has-text-left is-uppercase">
              <tr className="is-selected">
                <th>Name</th>
                <th>City</th>
                <th>Email</th>
                <th>Position</th>
                <th>Salary</th>
                <th>Delete</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ height: 60}} className="has-text-left">
                  <td className="is-capitalized is-vcentered">{user.id}.{user.name}</td>
                  <td className="is-capitalized is-vcentered">{user.city}</td>
                  <td className="is-lowercase is-vcentered">{user.email}</td>
                  <td className="is-capitalized is-vcentered">{user.position}</td>
                  <td className="is-vcentered">{user.salary}</td>
                  <td className="is-vcentered">
                    <span
                      className="icon has-text-danger"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Icon
                        path={mdiTrashCanOutline}
                      />
                    </span>
                  </td>
                  <td className="is-vcentered">
                    <span
                      className="icon has-text-danger"
                      onClick={() => updateUser(user.id)}
                    >
                      <Icon path={mdiTextBoxEditOutline}/>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
};
