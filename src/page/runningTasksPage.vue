<template>
  <div>
    <show-tasks :task-data="this.$store.state.runningTaskData" />
  </div>
</template>

<script>
import showTasks from '../components/showTasks'
export default {
  name: 'runningTasksPage',
  components: {
    showTasks
  }
}
</script>

<style scoped>

</style>
