import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import ProjectList from '../components/ProjectList/ProjectList';
import SpinnerIcon from '../components/Icons/SpinnerIcon';
import * as ProjectAPI from '../utilities/project-api';
import NewProjectModal from '../components/Modals/NewProjectModal';

export default function ProjectsPage({ projectNames, reloadProjects }) {
    const { user, userProjectInvites } = useAuth();
    const navigateTo = useNavigate();

    const [projects, setProjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [fieldProjectName, setFieldProjectName] = useState('');
    const [fieldProjectDescription, setFieldProjectDescription] = useState('');
    const [fieldProjectNameUnique, setFieldProjectNameUnique] = useState(true);
    const [loading, setLoading] = useState(true);

    // Reload project details
    useEffect(() => {
        if (!user) return;
        getProjectDetails();
    }, [user, userProjectInvites, projectNames]);

    // Get project details
    async function getProjectDetails() {
        if (!projectNames) return;
        if (projectNames.length === 0) {
            setLoading(false);
            return;
        }

        const { projects, error } = await ProjectAPI.getProjectDetails(
            projectNames.map((project) => project.id)
        );

        if (error) {
            console.error(error);
            return;
        }

        setProjects(projects);

        if (loading) setLoading(false);
    }

    // Validate and add new project to the db
    async function handleAddProject() {
        // check if project name is unique
        if (uniqueProjectName(fieldProjectName)) {
            setFieldProjectNameUnique(true);
        } else {
            setFieldProjectNameUnique(false);
            return;
        }

        // Add new project to db
        const { data, error } = await ProjectAPI.addProject(
            user.id,
            fieldProjectName,
            fieldProjectDescription
        );

        if (error) {
            console.error(error);
            return;
        }

        cleanModal();

        reloadProjects();
        navigateTo(`/projects/${data.id}`);
    }

    // Hide modal and clean modal fields
    function cleanModal() {
        setShowModal(false);
        setFieldProjectName('');
        setFieldProjectDescription('');
        setFieldProjectNameUnique(true);
    }

    function uniqueProjectName(projectName) {
        return !projectNames.find(
            (project) =>
                project.name.toLowerCase() === projectName.toLowerCase()
        );
    }

    function handleNewProjectName(e) {
        setFieldProjectName(e.target.value);

        if (uniqueProjectName(e.target.value)) {
            setFieldProjectNameUnique(true);
        } else {
            setFieldProjectNameUnique(false);
        }
    }

    function handleNewProjectDescription(e) {
        setFieldProjectDescription(e.target.value);
    }

    return (
        <>
            {loading ? (
                <SpinnerIcon />
            ) : (
                <div className='block p-4 m-2 rounded-lg shadow bg-gray-900 w-[95%] md:max-w-xl'>
                    <h5 className='mb-2 text-2xl font-bold tracking-tight mb-4'>
                        My Projects
                    </h5>

                    <ProjectList
                        projects={projects}
                        reloadProjects={reloadProjects}
                        setShowModal={setShowModal}
                    />

                    <NewProjectModal
                        visible={showModal}
                        handleCloseModal={cleanModal}
                        handleAddProject={handleAddProject}
                        handleNewProjectName={handleNewProjectName}
                        handleNewProjectDescription={handleNewProjectDescription}
                        projectName={fieldProjectName}
                        projectDescription={fieldProjectDescription}
                        projectNameUnique={fieldProjectNameUnique}
                    />
                </div>
            )}
        </>
    );
}
