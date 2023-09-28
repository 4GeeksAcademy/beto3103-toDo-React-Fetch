import React, { useEffect, useState } from "react";

let urlBaseApi = "https://playground.4geeks.com/apis/fake/todos/user/rgonzalezm"

//create your first component
const Home = () => {

	//estado guarda la información del input
	const [task, setTask] = useState({ label: "", done: false })
	const [tasksList, setTasksList] = useState([])
	const [error, setError] = useState(false)

	const getTask = async () => {
		try {
			let response = await fetch(urlBaseApi)
			let data = await response.json()
			if (response.status == 200) { //aveces es response.status o ok
				setTasksList(data)
			}
			if (response.status == 404) {
				createUser()
			}
			console.log(response)

		} catch (error) {
			console.log(error)
		}
	}

	const createUser = async () => {
		try {
			/*Cuando se hace post tiene 2 parámetros:
			1 la url a consultar
			2 el objeto con los detalles
			*/
			let response = await fetch(urlBaseApi, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify([])
			})

			if (response.ok) {
				getTask()
			}

			// console.log(response)
		} catch (error) {
			console.log(error)
		}
	}

	const handleChange = (e) => { // implícitiamente recibe el evento lo esta llamando onChange
		//  console.log(e.target.value) // se puede sacar el del evento el target y el valor
		// setTask(e.target.value)
		// const valueInput = e.target.value.toString()
		setTask({
			...task,
			label: e.target.value,
			done: false
		})
		// setTask(valueInput)
	}

	const handleSubmit = (e) => {
		e.preventDefault() // frenamos el burbujeo del form
	}

	const saveTask = async (e) => {

		if (e.key === "Enter") {
			if (task.label.trim() !== "") {
				// setTasksList([...tasksList, task])
				// setTask({
				// 	label: "",
				// 	done: false
				// })
				try {
					let response = await fetch(urlBaseApi, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify([...tasksList, task])
					})

					if (response.ok) {
						getTask()
						setTask({
							label: "",
							done: false
						})
						e.target.value = ""
					}

				} catch (error) {
					console.log(error)
				}

			} else {
				console.log("Debes digitar una tarea válida")
			}
			e.target.value = ""
		}
	}


	const deleteTask = async (id) => {
		let newArr = tasksList.filter((item, index) => index != id)
		try {
			let response = await fetch(urlBaseApi, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(newArr)
			})

			if (response.ok) {
				getTask()
			}
		} catch (error) {

		}

	}

	const deleteAllTask = async () => {
		try {
			let response = await fetch(urlBaseApi, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				}
			})
			if (response.ok) {
				getTask()
			}
		} catch (error) {
			console.log(error)
		}

	}

	useEffect(() => {
		getTask()
	}, [])

	return (
		<>
			<div className="container text-center justify-content-center mt-3">
				<div className="row justify-content-center">
					<div className="col-12 col-md-6">
						<h1>
							Mi lista de tareas
						</h1>
						<hr />
						<form onSubmit={handleSubmit}>
							<input
								type="text"
								placeholder="Agrega una tarea acá"
								className="form-control"
								value={task.label}
								name="label"
								onChange={handleChange}
								onKeyDown={saveTask}
							/>
						</form>

						{tasksList.map((item, index) => {
							return (
								<>
									<div className=" mt-3 border-top border-primary border-bottom">
										<div className="d-flex justify-content-between">
											<div className="" key={index}>
												{index + 1}) {item.label}
											</div>
											<div className="text-danger" onClick={() => {
												deleteTask(index)
											}}>
												x
											</div>
										</div>
									</div>
								</>
							)
						})}
						<button className="btn btn-danger mt-4" onClick={deleteAllTask}> Eliminar todas las tareas</button>
					</div>
				</div>
			</div>

		</>
	);
};

export default Home;
