import React, { Dispatch, SetStateAction } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import axios from 'axios';
import './Form.css';

type Props = {
  showModal: boolean,
  openModal: () => void,
  users: User[],
  setUserById: Dispatch<SetStateAction<User | null>>,
  userById: User | null,
};

enum Position {
  Accountant = 'Accountant',
  Data_Coordinator = 'Data Coordinator',
  Developer = 'Developer',
  Financial_Controller = 'Financial Controller',
  Integration_Specialist = 'Integration Specialist',
  Javascript_Developer = 'Javascript Developer',
  QA_Engineer = 'QA Engineer',
  Marketing_Designer = 'Marketing Designer',
  Regional_Director = 'Regional Director',
  Regional_Marketing = 'Regional Marketing',
  Software_Engineer = 'Software Engineer',
  Technical_Author = 'Technical Author',
};

export const Form: React.FC<Props> = ({ showModal, openModal, users, setUserById, userById }) => {
  const addUser = (
    id: number,
    name: string,
    city: string,
    email: string,
    position: string,
    salary: string,
  ) => {
    console.log(id, name, city, email, position, salary);
    return userById
      ? axios
       .put(`http://localhost:5000/users/${userById.id}`, { id, name, city, email, position, salary })
      : axios
       .post('http://localhost:5000/users', { id, name, city, email, position, salary })
       .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInput>({
    criteriaMode: "all",
    mode: "onChange"
  });

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    const userSalary = '$' + data.salary;
    const userId = userById?.id ? userById.id : Math.max(...users.map(item => item.id)) + 1
    addUser(
      userId,
      data.name,
      data.city,
      data.email,
      data.position,
      userSalary
    );
    reset();
    setUserById(null);
    openModal();
    window.location.reload();
  };

  const showHideClassName = showModal ? "form" : "display-none";

  return (
    <div className={showHideClassName}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="form-main box"
      >
      <h3>Form to add or update user</h3>
      <button
        className="modal-close is-large"
        aria-label="close"
        onClick={openModal}
      ></button>
        <div className="field">
          <label className="label has-text-left">Name</label>
          <div className="control">
            <input
              {...register("name", {required: true, minLength: 4})}
              className="input" type="text" placeholder="Your name" />
            <span>{errors.name ? 'This field is required and minLen = 4' : ''}</span>
          </div>
        </div>
        <div className="field">
          <label className="label has-text-left">City</label>
          <div className="control">
            <input
              {...register("city")}
              className="input" type="text" placeholder="Your city" />
            <span />
          </div>
        </div>
        <div className="field">
          <label className="label has-text-left">Email</label>
          <div className="control">
            <input
              {...register("email", {
                required: true,
                pattern:
                  // eslint-disable-next-line no-useless-escape
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              })}
              className="input" type="email" placeholder="Your email" />
            <span>{errors.email ? 'This is not a e-mail' : ''}</span>
          </div>
        </div>
        <div className="field">
          <label className="label has-text-left">Position</label>
          <div className="control">
            <div className="select is-fullwidth">
              <select className="has-text-left"
                {...register("position", { required: true })}
              >
                <option value="">Select position</option>
                {Object.values(Position).map(pos => (
                <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>
            <span>{errors.position ? 'This field is required' : ''}</span>
          </div>
        </div>
        <div className="field">
          <label className="label has-text-left">Salary</label>
          <div className="control">
            <input
              {...register("salary", {required: true, min: 10000, max: 100000})}
              className="input" type="number" placeholder="Your salary" />
            <span>{errors.salary ? 'Salary should be between 10000 && 100000' : ''}</span>
          </div>
        </div>
        <input
          type="submit"
        />
      </form>
    </div>
  )
}