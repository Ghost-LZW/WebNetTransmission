<template>
  <div>
    <show-tasks :task-data="this.$store.state.servingTaskData" />
  </div>
</template>

<script>
import showTasks from '../components/showTasks'

export default {
  name: 'servingTasksPage',
  components: {
    showTasks
  }
}
</script>

<style scoped>

</style>
