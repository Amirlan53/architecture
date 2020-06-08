package kz.politech.architecture.controllers;

import kz.politech.architecture.dao.ConfirmationTokenRepository;
import kz.politech.architecture.dao.UserRepository;
import kz.politech.architecture.model.ConfirmationToken;
import kz.politech.architecture.model.User;
import kz.politech.architecture.security.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

@Controller
public class ResetPasswordController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MyUserDetailsService myUserDetailsService;
    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;
    @Autowired
    public JavaMailSender emailSender;

    @GetMapping("/reset-password")
    public String registration(Model model) {

        return "reset-password";
    }

    @PostMapping("/reset-password")
    public String addUser(HttpServletRequest request,
                          @ModelAttribute("userForm") @Valid User userForm, BindingResult bindingResult, Model model) {

        String url = request.getRequestURL().toString();
        String baseURL = url.substring(0, url.length() - request.getRequestURI().length()) + request.getContextPath() + "/";
        System.out.println(baseURL);
        User existingUser = userRepository.findByUsername(userForm.getUsername());
        if (existingUser != null) {
            // Create token
            ConfirmationToken confirmationToken = new ConfirmationToken(existingUser);

            // Save it
            confirmationTokenRepository.save(confirmationToken);

            // Create the email
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(existingUser.getUsername());
            mailMessage.setSubject("Complete Password Reset!");
            mailMessage.setFrom("dambldor4444@gmail.com");
            mailMessage.setText("To complete the password reset process, please click here: "
                    + baseURL + "new-password?token="+confirmationToken.getConfirmationToken());

            // Send the email
            emailSender.send(mailMessage);

        }

        return "redirect:/";
    }

    @GetMapping("/new-password")
    public String newPassword(Model model, @RequestParam("token")String confirmationToken) {
        ConfirmationToken token = confirmationTokenRepository.findByConfirmationToken(confirmationToken);
        User user = userRepository.findByUsername(token.getUser().getUsername());
        userRepository.save(user);
        model.addAttribute("userForm", user);

        return "new-password";
    }

    @PostMapping("/new-password")
    public String newPasswordAdd(@ModelAttribute("userForm") @Valid User userForm, BindingResult bindingResult, Model model) {

        User existingUser = userRepository.findByUsername(userForm.getUsername());
        if (existingUser != null) {
            existingUser.setPassword(userForm.getPassword());
            existingUser.setPasswordConfirm(userForm.getPassword());

            myUserDetailsService.updateUser(existingUser);

        }

        return "redirect:/";
    }

}
