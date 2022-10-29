import { GithubIcon } from '@components';

const techs = ['next js', 'typescript', 'tailwind css', 'trpc'];

const renderTechs = () => techs
  .map((t) => <li className="underline-offset-2 underline dark:text-white" key={t}>{t}</li>);

export const MainCard = () => <div className="p-20 shadow-md bg-white dark:bg-slate-600">
  <h1 className="text-4xl m-4 text-center dark:text-white">nextjs template</h1>
  <h2 className="text-2xl m-2 text-center dark:text-white">techstack</h2>
  <ul className="flex justify-center items-center flex-col">
    {renderTechs()}
  </ul>

  <div className='flex justify-center items-center mt-10'>
    <a href="https://github.com/yanislav-igonin/nextjs-template" target="_blank" rel="noreferrer">
      <GithubIcon />
    </a>
  </div>
</div>;
