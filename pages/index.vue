<template>
  
</template>

<script>
export default {
  // Перенаправление на страницу login
  async asyncData({ redirect }) {
    return redirect('/login')
  }
}
</script>