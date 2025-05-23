import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthProvider';
import * as ProjectAPI from '../utilities/project-api';
import ProjectMembersList from '../components/ProjectMembersList/ProjectMembersList';
import ProjectTaskList from '../components/ProjectTaskList/ProjectTaskList';
import SpinnerIcon from '../components/Icons/SpinnerIcon';
import ErrorBubble from '../components/ErrorBubble';

export default function ProjectDetailsPage() {
    const { projectId } = useParams();
    const { user } = useAuth();
    const navigateTo = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    const projectRoleRef = useRef();
    const [errorMessage, setErrorMessage] = useState(null);

    const getProjectDetails = useCallback(async () => {
        if (!user || !projectId) return;

        const { data, error } = await ProjectAPI.getProject(user.id, projectId);

        if (error || !data) {
            console.error(error);
            setLoading(false);
            setErrorMessage("Error loading project details");
            return;
        }

        setErrorMessage(null);
        setProject(data);

        projectRoleRef.current = data?.project_member?.find(
            (member) => member.user_id === user.id
        )?.role_type.role_type;

        setLoading(false);
    }, [user, projectId]);

    // Use the callback in the effect
    useEffect(() => {
        if (user && projectId) {
            getProjectDetails();
        }
    }, [projectId, user, getProjectDetails]);

    async function handleRemoveMember(userId) {
        const { data, error } = await ProjectAPI.removeProjectMember(
            user.id,
            projectId,
            userId
        );
        getProjectDetails();

        if (user.id === userId) {
            navigateTo('/projects');
        }
    }

    function handleReloadProjectDetails() {
        getProjectDetails();
    }

    if (loading) return <SpinnerIcon />;

    if (!project) return (
        <>
            {errorMessage && <ErrorBubble level={"error"} message={errorMessage} />}
        </>
    );

    return (
        <div className='block p-4 m-2 rounded-lg shadow bg-gray-900 w-[95%] md:max-w-xl'>

            <h5 className='mb-2 text-2xl font-bold tracking-tight'>
                {project?.name}
            </h5>


            <div className='flex flex-col'>
                <div id='project-details' className='flex flex-col gap-4'>
                    <div className='flex items-center gap-2'>
                        <div className='font-bold'>Date Created:</div>
                        <div>{new Date(project.created_at).toLocaleDateString('en-AU')}</div>
                    </div>

                    <div>
                        <div className='font-bold mb-1'>Description</div>
                        <p className='whitespace-pre-wrap text-left'>
                            {project.description}
                        </p>
                    </div>
                </div>
                <div id='project-members' className='mt-6'>
                    <h2 className='border-b-2 text-left pl-2 my-4 italic'>
                        Team
                    </h2>
                    <ProjectMembersList
                        projectRole={projectRoleRef.current}
                        project={project}
                        handleRemoveMember={handleRemoveMember}
                        handleReloadProjectDetails={
                            handleReloadProjectDetails
                        }
                    />
                </div>
                <div id='project-tasks' className='mt-6'>
                    <h2 className='border-b-2 text-left pl-2 my-4 italic'>
                        Tasks
                    </h2>
                    <ProjectTaskList
                        projectRole={projectRoleRef.current}
                        project={project}
                        handleReloadProjectDetails={
                            handleReloadProjectDetails
                        }
                    />
                </div>
            </div>
        </div>
    );
}
