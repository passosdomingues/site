     * @async
     * @description Fetches initial data from models and triggers the first render of all views.
     *              Delegates section rendering to SectionController.
     */
    async renderInitialContent() {
        if (!this.isInitialized) {
            console.error('MainController: Cannot render initial content, controller not initialized.');
            return;
        }

        console.info('MainController: Rendering initial page content...');
        try {
            // Obter dados do usuário e do conteúdo com fallback
            let userData, sectionsData;
            
            try {
                userData = await this.models.user.getUserData();
                sectionsData = await this.models.content.getSections();
            } catch (error) {
                console.warn('MainController: Using fallback data due to initialization error:', error);
                userData = {
                    name: 'Rafael Passos Domingues',
                    title: 'Physicist & Computer Scientist',
                    summary: 'Researcher and Developer',
                    profileImage: 'assets/images/profile.jpg'
                };
                sectionsData = this.getFallbackSections();
            }

            // The MainController now delegates section rendering to the SectionController
            // The SectionController will handle rendering the sections into the #main-content container
            if (this.controllers.section) {
                await this.controllers.section.renderSections(sectionsData);
            } else {
                console.warn('MainController: SectionController not available to render sections.');
                // Fallback if SectionController is not available
                this.showErrorFallback(new Error('Section content controller not initialized.'));
            }

            console.info('MainController: Initial content rendering completed (delegated sections).');
            
            // Mark the main content as initialized to trigger CSS visibility
            const mainContentElement = document.getElementById('main-content');
            if (mainContentElement) {
                mainContentElement.setAttribute('data-main-initialized', 'true');
            }
            
        } catch (error) {
            console.error('MainController: Failed to render initial content.', error);
            this.showErrorFallback(error);
        }
    }

    // Adicione este método para fallback
    getFallbackSections() {
        return [
            {
                id: 'about',
                title: 'About Me',
                subtitle: 'My academic and professional journey',
