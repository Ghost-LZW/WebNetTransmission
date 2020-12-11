<template>
  <div>
    <show-tasks :task-data="this.$store.state.pausedTaskData" />
  </div>
</template>

<script>
import showTasks from '../components/showTasks'
export default {
  name: 'pausingTasksPage',
  components: {
    showTasks
  }
}
</script>

<style scoped>

</style>
