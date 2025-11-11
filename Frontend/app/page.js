"use client"
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {

  return (
    <>
      <Navbar />
      <main className="font-[Poppins,system-ui,sans-serif] relative min-h-screen py-6">
        <div className='max-w-5xl mx-auto px-4'>
        <section className="my-4 border border-gray-200 rounded-xl px-4 py-4 bg-white">
          <h1 className="text-2xl font-bold text-[#2563eb] py-2">About Us</h1>
          <ul className="mx-3">
            <li>Name: TodoTasker</li>
            <li>version: 0.1.0</li>
            <li><p>This is a Task Tracker Website named TodoTasker.You can manage your todos here.You can add the tasks which you have to perform.Once completed you can mark them as completed.It allow you to add extra information to the task like creation date,description etc.</p></li>
          </ul>

  </section>


  <section className="my-4 border border-gray-200 rounded-xl px-4 py-4 bg-white">
          <h1 className="text-2xl font-bold text-[#2563eb] py-2">Features</h1>
          <ul className="mx-3">
            <p>Features related to tasks:</p>
            <li>Create and delete tasks</li>
            <li>Sort them based on pending and completd status.</li>
            <li>Can track your tasks from anywhere and any device by signing in</li>
            <li>You can see full status of the tasks</li>
          </ul>
  </section>


  <section className="my-4 border border-gray-200 rounded-xl px-4 py-4 bg-white">
          <div  className="h-auto justify-items-center">
            <h1 className='text-3xl font-bold text-[#2563eb] py-2'>Contact</h1>
            <div className="linkedin flex gap-1 text-2xl">
              <Image src="/linkedin.svg" alt="linkedin" width={24} height={24}/>
              <a href="https://www.linkedin.com/in/lokesh-prajapati-026b7a328?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_self" rel="noopener" >Linkedin</a>
            </div>
            <div className="github flex gap-1 text-2xl">
              <Image src="/github.svg" alt="github" height={24} width={24}/>
              <a href="https://github.com/prajapati-lokesh16" target="_self" rel="noopener" >Github</a>
            </div>

          </div>
        </section>
        </div>
      </main>
    </>
  );
}
