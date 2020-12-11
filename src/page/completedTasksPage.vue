<template>
  <div>
    <show-tasks :task-data="this.$store.state.completedTaskData" />
  </div>
</template>

<script>
import showTasks from '../components/showTasks'

export default {
  name: 'completedTasksPage',
  components: {
    showTasks
  }
}
</script>

<style scoped>

</style>
