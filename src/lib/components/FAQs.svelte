<script lang="ts">

  const faqs = [
    {
      "question": "How do I create a new task?",
      "answer": "To create a new task, simply click the 'Add Task' button and fill in the task details."
    },
    {
      "question": "Can I set reminders for my tasks?",
      "answer": "Yes, you can set reminders for your tasks. Just click the bell icon next to the task and choose your preferred time."
    },
    {
      "question": "How do I delete a completed task?",
      "answer": "To delete a completed task, mark it as complete and then click the trash icon."
    },
    {
      "question": "Can I share my tasks with others?",
      "answer": "Currently, sharing tasks with others is not supported. This feature is under development."
    },
    {
      "question": "Is there a mobile app available?",
      "answer": "Not yet, but we are working on developing a mobile app for your convenience."
    },
    {
      "question": "How can I provide feedback?",
      "answer": "We appreciate your feedback! You can send us an email at support@ourwebapp.com or use the feedback form on our website."
    }
  ]
</script>

<div>
  <h1 class="text-center font-extrabold text-2xl">Frequently asked questions</h1>
    <div class="text-center">
    {#each faqs as faq}
      <div class="m-10">
        <h4 class="text-lg my-5 font-bold">{faq.question}</h4>
        <p class="">{faq.answer}</p>
      </div>
    {/each}
    </div>
</div>
