import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
//import { ExpressValidationError } from 'devu-shared-modules'

import PageWrapper from 'components/shared/layouts/pageWrapper'

import RequestService from 'services/request.service'

import { useActionless } from 'redux/hooks'
import TextField from 'components/shared/inputs/textField'
import { SET_ALERT } from 'redux/types/active.types'
import formStyles from './coursesFormPage.scss'
import AutomateDates from './automateDates'
import { removeClassFromField } from "../../../../utils/textField.utils";

const EditCourseFormPage = () => {
    const [setAlert] = useActionless(SET_ALERT);
    const history = useHistory();

    const [formData, setFormData] = useState({
        name: '',
        number: '',
        semester: 'f0000',
        isPublic: false 
    });

    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
    const [privateDate, setPrivateDate] = useState(new Date().toISOString().split("T")[0]);
    const [invalidFields,setInvalidFields] = useState(new Map<string, string>());

    const handleChange = (value: String, e : React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id
        setFormData(prevState => ({...prevState,[key] : value}))

        const newInvalidFields = removeClassFromField(invalidFields, key)
        setInvalidFields(newInvalidFields)
    }
    

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prevState => ({ ...prevState, isPublic: e.target.checked })); 
    };

    interface Dates {
        startDate: string;
        endDate: string;
    }

    
    const handleDatesChange = ({ startDate, endDate }: Dates) => {
        setStartDate(startDate);
        setEndDate(endDate);
    };

    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => { setStartDate(event.target.value) }
    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => { setEndDate(event.target.value) }

    const handlePrivateDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPrivateDate(event.target.value);
    };

    const formatDateForSubmission = (date: string) => {
        return new Date(date).toISOString();
    };
    

    const isFormValid = () => {
        return formData.name && formData.number && formData.semester && startDate && endDate;
    };
    

    const handleSubmit = () => {
        const finalFormData = {
            name: formData.name,
            number: formData.number,
            semester: formData.semester,
            startDate: formatDateForSubmission(startDate),
            endDate: formatDateForSubmission(endDate),
            isPublic: formData.isPublic,
            privateDate: formatDateForSubmission(privateDate) 
        };

        RequestService.post('/api/courses/instructor', finalFormData)
            .then(() => {
                setAlert({ autoDelete: true, type: 'success', message: 'Course Added' });
                history.goBack();
            })
            .catch((err) => {
                setAlert({ autoDelete: false, type: 'error', message: err.message });
            });
    };

    return (
        <PageWrapper>
            <h1>Create Course</h1>
            <div className={formStyles.courseFormWrapper}>
                <div className={formStyles.createDetailsForm}>
                    <TextField id='name' label={"Course Name*"} onChange={handleChange} value={formData.name}
                        invalidated={!!invalidFields.get("name")} helpText={invalidFields.get("name")} />
                    <TextField id='number' label={"Course Number*"} onChange={handleChange} value={formData.number}
                        invalidated={!!invalidFields.get("number")} helpText={invalidFields.get("number")} />
                    {/* <TextField id='semester' label={"Semester*"} onChange={handleChange} value={formData.semester}
                        placeholder='Ex. f2022, w2023, s2024' invalidated={!!invalidFields.get("semester")}
                        helpText={invalidFields.get("semester")} /> */}
                    <AutomateDates onDatesChange={handleDatesChange} />
                    <div className={formStyles.datepickerContainer}>
                        <div className={formStyles.fieldContainer}>
                            <label htmlFor='start-date'>Start Date *</label>
                            <input type="date" id="start-date" value={startDate} onChange={handleStartDateChange} />
                        </div>
                        <div className={formStyles.fieldContainer}>
                            <label htmlFor='end-date'>End Date *</label>
                            <input type="date" id="end-date" value={endDate} onChange={handleEndDateChange} />
                        </div>
                        <div>
                            <label htmlFor='private-date'>Private Date *</label>
                            <input type="date" id="private-date" value={privateDate} onChange={handlePrivateDateChange} />
                        </div>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.isPublic} 
                                onChange={handleCheckboxChange}
                            />
                            Make this course public
                        </label>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button className='btnPrimary' onClick={handleSubmit} disabled={!isFormValid()}>Create Course</button>
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default EditCourseFormPage;