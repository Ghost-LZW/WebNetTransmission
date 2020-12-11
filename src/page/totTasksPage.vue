<template>
  <div>
    <show-tasks :task-data="this.$store.state.totTaskData" />
  </div>
</template>

<script>
import showTasks from '../components/showTasks'
export default {
  name: 'totTasksPage',
  components: {
    showTasks
  }
}
</script>

<style scoped>

</style>
