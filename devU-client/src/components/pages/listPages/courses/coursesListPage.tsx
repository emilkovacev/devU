import React, { useEffect, useState } from 'react';
import { Course } from 'devu-shared-modules';
import LoadingOverlay from 'components/shared/loaders/loadingOverlay';
import PageWrapper from 'components/shared/layouts/pageWrapper';
import Dropdown, { Option } from 'components/shared/inputs/dropdown';
import ErrorPage from '../../errorPage/errorPage';
import RequestService from 'services/request.service';
import styles from './coursesListPage.scss';
import CourseListItem from "../../../listItems/courseListItem";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";
import { useAppSelector } from "../../../../redux/hooks";

type Filter = true | false;

const filterOptions: Option<Filter>[] = [
    { label: 'Expand All', value: true },
    { label: 'Collapse All', value: false },
];

const UserCoursesListPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [filter, setFilter] = useState<Filter>(false);
    const history = useHistory();

    // Get userId from Redux store
    const userId = useAppSelector((store) => store.user.id);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch user-specific courses
            const userCourseData = await RequestService.get<{ 
                instructorCourses: Course[]; 
                activeCourses: Course[]; 
                pastCourses: Course[]; 
                upcomingCourses: Course[]; 
            }>(`/api/courses/user/${userId}`);
            
            // Flatten and combine user course data into a single array
            const userCoursesList = [
                ...userCourseData.instructorCourses,
                ...userCourseData.activeCourses,
                ...userCourseData.pastCourses,
                ...userCourseData.upcomingCourses,
            ];

            // Fetch all courses
            const allCourseData = await RequestService.get<Course[]>(`/api/courses`);

            // Filter to get courses the user is not enrolled in
            const unenrolledCourses = allCourseData.filter(
                (course) => !userCoursesList.some((userCourse) => userCourse.id === course.id)
            );

          
            setAllCourses(unenrolledCourses);
        } catch (error: any) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (updatedFilter: Filter) => {
        setFilter(updatedFilter);
    };

    if (loading) return <LoadingOverlay delay={250} />;
    if (error) return <ErrorPage error={error} />;

    const defaultOption = filterOptions.find((o) => o.value === filter);

    return (
        <PageWrapper>
            <div className={styles.header}>
                <div className={styles.smallLine}></div>
                <h1>All Courses</h1>
                <div className={styles.largeLine}></div>

                <Button variant="contained" onClick={() => history.push(`/addCoursesForm`)}>
                    Add Course
                </Button>
                <div className={styles.filters}>
                    <Dropdown
                        label='Courses Display Options'
                        className={styles.dropdown}
                        options={filterOptions}
                        onChange={handleFilterChange}
                        defaultOption={defaultOption}
                    />
                </div>
            </div>
            {allCourses.map((course) => (
                <CourseListItem course={course} key={course.id} isOpen={filter} />
            ))}
        </PageWrapper>
    );
};

export default UserCoursesListPage;